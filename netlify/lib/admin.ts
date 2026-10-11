import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { and, eq, gt, lt, ne } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { adminSessions, storeMeta } from '../../db/schema.js';

// Starting PIN, accepted only until the owner sets their own. It was shown publicly in an older version of the page.
const STARTER_PIN = '7006';
const PIN_KEY = 'admin_pin_hash';
const FAILURES_KEY = 'admin_pin_failures';
const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;
const SESSION_HOURS = 12;

export const PIN_PATTERN = /^\d{6,8}$/;

async function getMeta(key: string) {
  const [row] = await db.select().from(storeMeta).where(eq(storeMeta.key, key));
  return row?.value ?? null;
}

async function setMeta(key: string, value: string) {
  await db
    .insert(storeMeta)
    .values({ key, value })
    .onConflictDoUpdate({ target: storeMeta.key, set: { value } });
}

function hashPin(pin: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(pin, salt, 64).toString('hex')}`;
}

function pinMatches(pin: string, stored: string) {
  const [salt, hash] = stored.split(':');
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(pin, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

// Optional emergency PIN set as a Netlify environment variable, for when the owner forgets their PIN
function recoveryPinMatches(pin: string) {
  const recovery = process.env.ADMIN_RECOVERY_PIN;
  if (!recovery || recovery.length < 6) return false;
  const a = Buffer.from(sha256(pin));
  const b = Buffer.from(sha256(recovery));
  return timingSafeEqual(a, b);
}

export type LoginResult =
  | { ok: true; token: string; mustChangePin: boolean }
  | { ok: false; status: number; error: string };

export async function login(pin: string): Promise<LoginResult> {
  const failures = JSON.parse((await getMeta(FAILURES_KEY)) ?? '{"count":0,"lockedUntil":0}');
  if (failures.lockedUntil > Date.now()) {
    const minutes = Math.ceil((failures.lockedUntil - Date.now()) / 60000);
    return { ok: false, status: 429, error: `Too many wrong attempts. Try again in ${minutes} min.` };
  }

  const stored = await getMeta(PIN_KEY);
  const usingStarter = !stored;
  const valid = recoveryPinMatches(pin) || (stored ? pinMatches(pin, stored) : pin === STARTER_PIN);

  if (!valid) {
    const count = failures.count + 1;
    const locked = count >= MAX_FAILURES;
    await setMeta(
      FAILURES_KEY,
      JSON.stringify({ count: locked ? 0 : count, lockedUntil: locked ? Date.now() + LOCK_MINUTES * 60000 : 0 }),
    );
    return { ok: false, status: 401, error: 'Incorrect PIN. Please try again.' };
  }

  await setMeta(FAILURES_KEY, JSON.stringify({ count: 0, lockedUntil: 0 }));
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
  const token = randomBytes(32).toString('base64url');
  await db.insert(adminSessions).values({
    tokenHash: sha256(token),
    expiresAt: new Date(Date.now() + SESSION_HOURS * 3600000),
  });
  return { ok: true, token, mustChangePin: usingStarter };
}

function tokenFrom(req: Request) {
  const header = req.headers.get('authorization') ?? '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

// Returns the session token hash if the request comes from a signed-in admin
export async function adminSession(req: Request): Promise<string | null> {
  const token = tokenFrom(req);
  if (!token) return null;
  const tokenHash = sha256(token);
  const [row] = await db
    .select()
    .from(adminSessions)
    .where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, new Date())));
  return row ? tokenHash : null;
}

export async function logout(tokenHash: string) {
  await db.delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash));
}

export async function pinIsStarter() {
  return !(await getMeta(PIN_KEY));
}

export async function changePin(tokenHash: string, currentPin: string, newPin: string) {
  const stored = await getMeta(PIN_KEY);
  const currentOk = recoveryPinMatches(currentPin) || (stored ? pinMatches(currentPin, stored) : currentPin === STARTER_PIN);
  if (!currentOk) return { ok: false, error: 'Current PIN is incorrect.' };
  if (!PIN_PATTERN.test(newPin)) return { ok: false, error: 'New PIN must be 6 to 8 digits.' };
  await setMeta(PIN_KEY, hashPin(newPin));
  // Sign out every other device that was using the old PIN
  await db.delete(adminSessions).where(ne(adminSessions.tokenHash, tokenHash));
  return { ok: true };
}
