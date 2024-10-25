import { z } from 'zod';

export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.string().transform(Number),

  // API
  API_DOMAIN: z.string().url(),
  WEBSITE_DOMAIN: z.string().url(),
  PORT: z.string().transform(Number).default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // SuperTokens
  SUPERTOKENS_CONNECTION_URI: z.string().url(),
  SUPERTOKENS_API_KEY: z.string().optional(),

  // App specific
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  ENABLE_SWAGGER: z.coerce.boolean().default(false),
  CORS_ORIGINS: z.string().transform((val) => val.split(',')),
  RATE_LIMIT_TTL: z.string().transform(Number).default('60'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
});

export type EnvConfig = z.infer<typeof envSchema>;
