import { integer, numeric, pgTable, timestamp } from 'drizzle-orm/pg-core';
import user from './user';
import { relations } from 'drizzle-orm';
import orderStatus from './order-status';

const order = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: integer('userId')
    .notNull()
    .references(() => user.id),
  estimatedDeliveryTime: timestamp('estimatedDeliveryTime', {
    mode: 'string',
  }),
  actualDeliveryTime: timestamp('actualDeliveryTime', { mode: 'string' }),
  items: integer('items').notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  discount: numeric('discount', { precision: 12, scale: 2 }).default('0'),
  totalPrice: numeric('totalPrice', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  orderStatuses: many(orderStatus),
}));

export default order;
