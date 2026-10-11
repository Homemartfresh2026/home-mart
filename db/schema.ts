import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import type { Product, OrderRecord } from '../src/types';

export const products = pgTable('products', {
  id: text().primaryKey(),
  data: jsonb().$type<Product>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: text().primaryKey(),
  // Secret handed only to the customer who placed the order, so they can check its status
  accessToken: text('access_token').notNull(),
  status: text().notNull().default('pending'),
  data: jsonb().$type<OrderRecord>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Simple key/value flags, e.g. whether the starter catalogue was loaded
export const storeMeta = pgTable('store_meta', {
  key: text().primaryKey(),
  value: text().notNull(),
});

// Shared store data edited from the Admin panel (products, notices, riders, customers), one row per collection
export const storeState = pgTable('store_state', {
  key: text().primaryKey(),
  data: jsonb().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Signed-in admin devices. Only a hash of each session token is stored.
export const adminSessions = pgTable('admin_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
