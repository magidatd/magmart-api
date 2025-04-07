import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import user from './user';
import { relations } from 'drizzle-orm';

const refreshTokens = pgTable('refreshTokens', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  hashedToken: text('hashedToken').notNull().unique(),
  userId: integer('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  revoked: boolean('revoked').default(false),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
  expireAt: timestamp('expireAt'),
});

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(user, {
    fields: [refreshTokens.userId],
    references: [user.id],
  }),
}));

export default refreshTokens;
