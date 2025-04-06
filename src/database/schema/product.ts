import { relations, sql } from 'drizzle-orm';
import { boolean, numeric, timestamp } from 'drizzle-orm/pg-core';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import user from './user';
import category from './category';

const product = pgTable('products', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  discountPrice: numeric('discountPrice').default('0'),
  countInStock: numeric('countInStock').notNull(),
  sku: text('sku').notNull().unique(),
  categoryId: integer('categoryId')
    .notNull()
    .references(() => category.id),
  brand: text('brand'),
  sizes: text('sizes')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  colours: text('colours')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  collections: text('collections').notNull(),
  material: text('material'),
  gender: text('gender').notNull(),
  images: text('images')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  imageAlt: text('imageAlt')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  isFeatured: boolean('isFeatured').default(false),
  isPublished: boolean('isPublished').default(false),
  rating: integer('rating').default(0),
  numberOfReviews: integer('numberOfReviews').default(0),
  tags: text('tags')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  metaKeywords: text('metaKeywords'),
  dimensionsLength: numeric('dimensionsLength').default('0'),
  dimensionsWidth: numeric('dimensionsWidth').default('0'),
  dimensionsHeight: numeric('dimensionsHeight').default('0'),
  weight: numeric('weight').default('0'),
  creatorId: integer('creatorIdd')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const addressRelations = relations(product, ({ one }) => ({
  user: one(user, {
    fields: [product.creatorId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
}));

export default product;
