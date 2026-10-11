import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { storeState } from '../../db/schema.js';
import { STARTER_CATEGORIES, STARTER_PRODUCTS } from './catalogue.js';

export const COLLECTIONS = ['products', 'categories', 'notifications', 'riders', 'crm'] as const;
export type Collection = (typeof COLLECTIONS)[number];

// Starting data used until the owner saves their own from the Admin panel
const DEFAULTS: Record<Collection, unknown[]> = {
  products: [
    { id: 1, name: 'Honeycrisp Apples', cat: 'fruits', unit: '1 kg', price: 180, strike: 220, emoji: '🍎', tag: 'Organic Fresh', inStock: true },
    { id: 2, name: 'Baby Palak (Spinach)', cat: 'fruits', unit: '250g pack', price: 30, strike: 40, emoji: '🥬', tag: 'Farm Picked', inStock: true },
    { id: 3, name: 'Ripe Hass Avocados', cat: 'fruits', unit: 'Pack of 2', price: 190, strike: 240, emoji: '🥑', tag: 'Ready to Eat', inStock: true },
    { id: 4, name: 'Hybrid Roma Tomatoes', cat: 'fruits', unit: '1 kg', price: 38, strike: 50, emoji: '🍅', tag: 'Vine Ripe', inStock: true },
    { id: 5, name: 'Cavendish Bananas', cat: 'fruits', unit: '1 kg', price: 45, strike: 55, emoji: '🍌', tag: 'Sweet & Fresh', inStock: true },
    { id: 6, name: 'Bell Peppers Trio', cat: 'fruits', unit: 'Pack of 3', price: 75, strike: 90, emoji: '🫑', tag: 'Farm Crisp', inStock: true },
    { id: 7, name: 'Daawat Rozana Basmati Rice', cat: 'staples', unit: '1 kg', price: 85, strike: 110, emoji: '🍚', tag: 'Aromatic Grain', inStock: true },
    { id: 8, name: 'Tata Sampann Toor Dal', cat: 'staples', unit: '1 kg', price: 165, strike: 190, emoji: '🥣', tag: 'Unpolished', inStock: true },
    { id: 9, name: 'Pampers Diaper Pants (M)', cat: 'baby', unit: 'Pack of 24', price: 349, strike: 410, emoji: '👶', tag: 'Ultra Dry', inStock: true },
    { id: 10, name: 'Himalaya Baby Wipes', cat: 'baby', unit: '72s Pack', price: 145, strike: 175, emoji: '🌿', tag: 'Alcohol Free', inStock: true },
    { id: 11, name: 'Dettol Liquid Handwash Refill', cat: 'toiletries', unit: '200ml pouch', price: 89, strike: 99, emoji: '🧴', tag: 'Germ Shield', inStock: true },
    { id: 12, name: 'Colgate MaxFresh Gel', cat: 'toiletries', unit: '150g pack', price: 110, strike: 135, emoji: '🪥', tag: 'Spicy Fresh', inStock: true },
    ...STARTER_PRODUCTS,
  ],
  categories: STARTER_CATEGORIES,
  notifications: [
    { id: 1, title: '⚡ Flash Discount: ₹50 OFF Orders Over ₹300!', desc: 'Direct farm harvest discount automatically applied at checkout.', isBanner: true, active: true },
    { id: 2, title: '🛵 Express EV Delivery Active in 15–25 mins', desc: 'Temperature-controlled insulated boxes keep your vegetables crisp.', isBanner: false, active: true },
    { id: 3, title: '🔄 100% Quality Assurance & Instant UPI Return Desk', desc: 'Refunds reversed directly to your UPI ID within 2 hours of delivery.', isBanner: false, active: true },
  ],
  riders: [
    { id: 'r1', name: 'Ramesh K.', phone: '7006934064', vehicle: 'Electric EV Hub #4', rating: '4.9★', isCurrent: true },
    { id: 'r2', name: 'Sunil M.', phone: '9845012345', vehicle: 'Honda Activa Eco #2', rating: '4.8★', isCurrent: false },
    { id: 'r3', name: 'Vikas P.', phone: '9123456780', vehicle: 'Ather 450X Superfast', rating: '5.0★', isCurrent: false },
  ],
  crm: [],
};

export function isCollection(key: unknown): key is Collection {
  return COLLECTIONS.includes(key as Collection);
}

export async function getCollection<T = any>(key: Collection): Promise<T[]> {
  const [row] = await db.select().from(storeState).where(eq(storeState.key, key));
  return (row?.data as T[]) ?? (DEFAULTS[key] as T[]);
}

export async function setCollection(key: Collection, data: unknown[]) {
  await db
    .insert(storeState)
    .values({ key, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: storeState.key, set: { data, updatedAt: new Date() } });
}

// Strips characters that could inject HTML, since the Admin panel renders these values as markup
export function cleanText(value: unknown, max = 200): string {
  return String(value ?? '')
    .replace(/[<>"'`&]/g, '')
    .trim()
    .slice(0, max);
}

export function cleanPhone(value: unknown): string {
  return String(value ?? '').replace(/\D/g, '').slice(-10);
}
