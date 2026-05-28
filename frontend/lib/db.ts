import { Pool } from 'pg';

const globalForPg = globalThis as unknown as {
  pgPool: Pool | undefined;
};

// Create a single connection pool that persists across hot-reloads in development
export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool;

export default pool;
