import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.TIMEWEB_DB_HOST,
  port: parseInt(process.env.TIMEWEB_DB_PORT || '5432'),
  database: process.env.TIMEWEB_DB_NAME,
  user: process.env.TIMEWEB_DB_USER,
  password: process.env.TIMEWEB_DB_PASSWORD,
  ssl: false,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
