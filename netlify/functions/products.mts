import type { Config, Context } from '@netlify/functions';
import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { products, storeMeta } from '../../db/schema.js';
import { INITIAL_PRODUCTS } from '../../src/data/initialData.js';
import { requireAdmin } from '../lib/auth.js';
import type { Product } from '../../src/types.js';

// Load the starter catalogue once, the first time the store is opened
async function seedOnce() {
  const [seeded] = await db.select().from(storeMeta).where(eq(storeMeta.key, 'catalogue_seeded'));
  if (seeded) return;
  const base = Date.now();
  await db
    .insert(products)
    .values(INITIAL_PRODUCTS.map((p, i) => ({ id: p.id, data: p, createdAt: new Date(base - i) })))
    .onConflictDoNothing();
  await db.insert(storeMeta).values({ key: 'catalogue_seeded', value: 'true' }).onConflictDoNothing();
}

function isValidProduct(p: unknown): p is Product {
  const v = p as Product;
  return (
    !!v &&
    typeof v.id === 'string' &&
    v.id.length > 0 &&
    v.id.length <= 100 &&
    typeof v.name === 'string' &&
    v.name.trim().length > 0 &&
    typeof v.price === 'number' &&
    v.price >= 0 &&
    typeof v.inStock === 'boolean'
  );
}

export default async (req: Request, context: Context) => {
  const id = context.params.id;

  if (req.method === 'GET' && !id) {
    await seedOnce();
    const rows = await db.select().from(products).orderBy(desc(products.createdAt));
    return Response.json(rows.map((r) => r.data));
  }

  const denied = await requireAdmin(req);
  if (denied) return denied;

  if (req.method === 'POST' && !id) {
    const body = await req.json().catch(() => null);
    if (!isValidProduct(body)) return new Response('Invalid product', { status: 400 });
    // New products appear at the top of the storefront
    const [row] = await db
      .insert(products)
      .values({ id: body.id, data: body })
      .onConflictDoNothing()
      .returning();
    if (!row) return new Response('Product already exists', { status: 409 });
    return Response.json(row.data, { status: 201 });
  }

  if (req.method === 'PUT' && id) {
    const body = await req.json().catch(() => null);
    if (!isValidProduct(body) || body.id !== id) return new Response('Invalid product', { status: 400 });
    const [row] = await db.update(products).set({ data: body }).where(eq(products.id, id)).returning();
    if (!row) return new Response('Not found', { status: 404 });
    return Response.json(row.data);
  }

  if (req.method === 'DELETE' && id) {
    await db.delete(products).where(eq(products.id, id));
    return new Response(null, { status: 204 });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: ['/api/products', '/api/products/:id'],
};
