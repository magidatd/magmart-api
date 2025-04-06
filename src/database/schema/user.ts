import { relations } from 'drizzle-orm';
import { integer, text, timestamp } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import address from './address';
import refreshTokens from './refresh-tokens';
import order from './order';

const user = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('customer'),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const userRelations = relations(user, ({ one, many }) => ({
  address: one(address),
  refreshTokens: many(refreshTokens),
  orders: many(order),
}));

export default user;
