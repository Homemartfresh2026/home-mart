import type { Config } from '@netlify/functions';
import { adminSession, changePin, login, logout, pinIsStarter } from '../lib/admin.js';
import { STARTER_CATEGORIES, STARTER_PRODUCTS } from '../lib/catalogue.js';
import { COLLECTIONS, getCollection, isCollection, setCollection } from '../lib/store.js';

// Store-owner endpoints. Everything except login needs a valid admin session token.

const MAX_BYTES = 500_000;

function validItems(key: string, items: unknown): items is any[] {
  if (!Array.isArray(items) || items.length > 5000) return false;
  return items.every((i: any) => {
    if (!i || typeof i !== 'object') return false;
    if (key === 'products') return typeof i.name === 'string' && typeof i.price === 'number' && i.price >= 0;
    if (key === 'categories') return typeof i.id === 'string' && i.id.length > 0 && typeof i.name === 'string';
    if (key === 'notifications') return typeof i.title === 'string' && typeof i.desc === 'string';
    if (key === 'riders' || key === 'crm') return typeof i.name === 'string' && typeof i.phone === 'string';
    return false;
  });
}

export default async (req: Request) => {
  const path = new URL(req.url).pathname;

  if (path === '/api/admin/login' && req.method === 'POST') {
    const { pin } = await req.json().catch(() => ({}));
    if (typeof pin !== 'string' || !pin) return Response.json({ error: 'Enter your PIN.' }, { status: 400 });
    const result = await login(pin.trim());
    if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
    return Response.json({ token: result.token, mustChangePin: result.mustChangePin });
  }

  const session = await adminSession(req);
  if (!session) return Response.json({ error: 'Please sign in again.' }, { status: 401 });

  if (path === '/api/admin/logout' && req.method === 'POST') {
    await logout(session);
    return Response.json({ ok: true });
  }

  if (path === '/api/admin/pin' && req.method === 'POST') {
    const { currentPin, newPin } = await req.json().catch(() => ({}));
    const result = await changePin(session, String(currentPin ?? '').trim(), String(newPin ?? '').trim());
    return Response.json(result, { status: result.ok ? 200 : 400 });
  }

  // Store data stays locked until the starter PIN has been replaced
  if (await pinIsStarter()) {
    return Response.json({ error: 'Set a new admin PIN first.', mustChangePin: true }, { status: 403 });
  }

  if (path === '/api/admin/data' && req.method === 'GET') {
    const entries = await Promise.all(COLLECTIONS.map(async (k) => [k, await getCollection(k)] as const));
    return Response.json(Object.fromEntries(entries));
  }

  // Adds the starter categories and items the store doesn't have yet, matched by name. Existing items are left untouched.
  if (path === '/api/admin/starter-items' && req.method === 'POST') {
    const [products, categories] = await Promise.all([getCollection<any>('products'), getCollection<any>('categories')]);
    const catIds = new Set(categories.map((c) => c.id));
    const newCats = STARTER_CATEGORIES.filter((c) => !catIds.has(c.id));
    const names = new Set(products.map((p) => String(p.name).toLowerCase()));
    let id = Math.max(Date.now(), ...products.map((p) => Number(p.id) || 0)) + 1;
    const newItems = STARTER_PRODUCTS.filter((p) => !names.has(p.name.toLowerCase())).map((p) => ({ ...p, id: id++ }));
    await setCollection('categories', [...categories, ...newCats]);
    await setCollection('products', [...products, ...newItems]);
    return Response.json({ addedItems: newItems.length, addedCategories: newCats.length });
  }

  const match = path.match(/^\/api\/admin\/data\/([a-z]+)$/);
  if (match && req.method === 'PUT') {
    const key = match[1];
    if (!isCollection(key)) return Response.json({ error: 'Unknown data type' }, { status: 404 });
    const raw = await req.text();
    if (raw.length > MAX_BYTES) return Response.json({ error: 'Too much data' }, { status: 413 });
    let items: unknown;
    try {
      items = JSON.parse(raw);
    } catch {
      return Response.json({ error: 'Invalid data' }, { status: 400 });
    }
    if (!validItems(key, items)) return Response.json({ error: 'Invalid data' }, { status: 400 });
    await setCollection(key, items);
    return Response.json({ ok: true });
  }

  return new Response('Not found', { status: 404 });
};

export const config: Config = {
  path: ['/api/admin/login', '/api/admin/logout', '/api/admin/pin', '/api/admin/data', '/api/admin/data/:key', '/api/admin/starter-items'],
};
