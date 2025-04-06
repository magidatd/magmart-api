import { defineConfig } from 'drizzle-kit';
import env from './src/env';

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      env.DATABASE_URL ||
      'postgresql://magidatd:12345678@localhost:5432/api_magmart',
  },
  verbose: true,
  strict: true,
});
