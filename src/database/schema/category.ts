import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const category = pgTable('category', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: text('name').notNull().unique(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export default category;
