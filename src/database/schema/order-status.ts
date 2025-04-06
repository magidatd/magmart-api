import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import order from './order';
import { relations } from 'drizzle-orm';
import statusCatalog from './status-catalog';

const orderStatus = pgTable('orderStatus', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  orderId: integer('orderId')
    .notNull()
    .references(() => order.id),
  statusCatalogId: integer('statusCatalogId')
    .notNull()
    .references(() => statusCatalog.id),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
});

export const orderStatusRelations = relations(orderStatus, ({ one }) => ({
  order: one(order, {
    fields: [orderStatus.orderId],
    references: [order.id],
  }),
  statusCatalog: one(statusCatalog, {
    fields: [orderStatus.statusCatalogId],
    references: [statusCatalog.id],
  }),
}));

export default orderStatus;
