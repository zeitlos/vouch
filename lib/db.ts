import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let initialized = false;

async function ensureTable() {
  if (initialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      votes INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Added after the initial schema; safe to run on existing tables.
  await pool.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_key TEXT');

  initialized = true;
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  await ensureTable();
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export default pool;
