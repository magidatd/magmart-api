import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import product from './product';
import { relations } from 'drizzle-orm';
import order from './order';

const orderProductItem = pgTable('orderProductItem', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  orderId: integer('orderId')
    .notNull()
    .references(() => order.id),
  productId: integer('productId')
    .notNull()
    .references(() => product.id),
  size: text('size').notNull(),
  colour: text('colour').notNull(),
  quantity: integer('quantity').notNull(),
  itemPrice: numeric('itemPrice', { precision: 12, scale: 2 }).notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  comment: text('comment'),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
});

export const orderProductItemRelations = relations(
  orderProductItem,
  ({ one }) => ({
    order: one(order, {
      fields: [orderProductItem.orderId],
      references: [order.id],
    }),
    product: one(product, {
      fields: [orderProductItem.productId],
      references: [product.id],
    }),
  }),
);

export default orderProductItem;
