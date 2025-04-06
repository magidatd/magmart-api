import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

import { ZodError, z } from 'zod';

const stringBoolean = z.coerce
  .string()
  .transform((val) => {
    return val === 'true';
  })
  .default('false');

const environmentSchema = z.object({
  NODE_ENV: z.string().default('deve;opment'),
  DB_HOST: z.string().default('localhost'),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DATABASE_URL: z.string().optional(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
});

export type environmentSchema = z.infer<typeof environmentSchema>;

expand(config());

try {
  environmentSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env file:\n';

    error.issues.forEach((issue) => {
      message += `- ${issue.path.join('.')}: ${issue.message}\n`;
    });

    const errorMessage = new Error(message);

    errorMessage.stack = '';

    throw errorMessage;
  } else {
    console.error(error);
  }
}

export default environmentSchema.parse(process.env);
