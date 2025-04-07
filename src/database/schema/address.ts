import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import user from './user';
import { relations } from 'drizzle-orm';

const address = pgTable('address', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  streetAddress: text('streetAddress').notNull(),
  postalCode: text('postalCode').notNull(),
  userId: integer('userId')
    .notNull()
    .references(() => user.id),
  city: text('city').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
}));

export default address;
