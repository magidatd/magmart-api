import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../database/schema';
import env from '../env';

export const connection = postgres(
  env.DATABASE_URL ||
    'postgresql://magidatd:12345678@localhost:5432/apimagmart',
  {
    max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
    onnotice: env.DB_SEEDING ? () => {} : undefined,
  },
);

export const db = drizzle(connection, { schema, logger: true });

export type db = typeof db;

export default db;
