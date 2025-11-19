import { env } from '@saas/env';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'prisma/seed.ts',
  },
  engine: 'classic',
  datasource: {
    url: env.DATABASE_URL,
  },
});
