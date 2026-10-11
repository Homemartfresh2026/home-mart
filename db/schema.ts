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
