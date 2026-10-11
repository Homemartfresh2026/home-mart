import type { Config } from '@netlify/functions';
import { cleanPhone, cleanText, getCollection, setCollection } from '../lib/store.js';

// Public storefront endpoints used by every customer. Nothing here can change products, notices or riders.

type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  tier: string;
  activePerk: string;
};

async function storefront() {
  const [products, notifications, riders] = await Promise.all([
    getCollection('products'),
    getCollection('notifications'),
    getCollection('riders'),
  ]);
  const active = riders.find((r: any) => r.isCurrent) ?? riders[0] ?? null;
  // Customers only see the rider on duty, not the whole fleet
  const rider = active
    ? { name: active.name, phone: active.phone, vehicle: active.vehicle, rating: active.rating }
    : null;
  return Response.json({
    products,
    notifications: notifications.filter((n: any) => n.active !== false),
    rider,
  });
}

// Returns only the loyalty tier and perk, so a phone number can't be used to look up someone's name or address
async function lookup(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone = cleanPhone(body.phone);
  if (phone.length !== 10) return Response.json({ customer: null });
  const crm = await getCollection<Customer>('crm');
  const c = crm.find((x) => x.phone === phone);
  return Response.json({ customer: c ? { tier: c.tier, activePerk: c.activePerk } : null });
}

// Records an order in the customer list. The total is worked out from the store's own prices.
async function recordOrder(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.cart !== 'object' || body.cart === null) {
    return Response.json({ error: 'Invalid order' }, { status: 400 });
  }
  const name = cleanText(body.name, 80) || 'Valued Shopper';
  const phone = cleanPhone(body.phone);
  const address = cleanText(body.address, 300);
  if (phone.length !== 10) return Response.json({ error: 'Invalid phone number' }, { status: 400 });

  const products = await getCollection<any>('products');
  let total = 0;
  for (const [id, qty] of Object.entries(body.cart)) {
    const item = products.find((p) => String(p.id) === id && p.inStock !== false);
    const n = Math.floor(Number(qty));
    if (item && n > 0 && n <= 100) total += item.price * n;
  }
  if (total <= 0) return Response.json({ error: 'Basket is empty' }, { status: 400 });

  const crm = await getCollection<Customer>('crm');
  const existing = crm.find((c) => c.phone === phone);
  if (existing) {
    existing.ordersCount += 1;
    existing.totalSpent += total;
    existing.name = name;
    if (address) existing.address = address;
    if (existing.ordersCount >= 10) {
      existing.tier = '⭐ VIP Gold (10+ orders)';
      if (!existing.activePerk) existing.activePerk = 'Free 500g Alphonso Mangoes';
    } else if (existing.ordersCount >= 4) {
      existing.tier = '🥈 Silver Regular (4+ orders)';
    }
  } else {
    crm.unshift({
      id: 'c_' + Date.now(),
      name,
      phone,
      address,
      ordersCount: 1,
      totalSpent: total,
      tier: '🌱 New Shopper',
      activePerk: 'Welcome Gift: Organic Mint Bunch',
    });
  }
  await setCollection('crm', crm.slice(0, 5000));
  return Response.json({ ok: true });
}

export default async (req: Request) => {
  const path = new URL(req.url).pathname;
  if (path === '/api/store' && req.method === 'GET') return storefront();
  if (path === '/api/customer-lookup' && req.method === 'POST') return lookup(req);
  if (path === '/api/orders' && req.method === 'POST') return recordOrder(req);
  return new Response('Not found', { status: 404 });
};

export const config: Config = {
  path: ['/api/store', '/api/customer-lookup', '/api/orders'],
};
