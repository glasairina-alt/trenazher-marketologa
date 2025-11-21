import { Pool } from 'pg';

// Encode password to handle special characters
const encodePassword = (password: string) => {
  return encodeURIComponent(password);
};

const password = process.env.TIMEWEB_DB_PASSWORD || '';
const encodedPassword = encodePassword(password);

// Use connection string with properly encoded password
const connectionString = `postgresql://${process.env.TIMEWEB_DB_USER}:${encodedPassword}@${process.env.TIMEWEB_DB_HOST}:${process.env.TIMEWEB_DB_PORT}/${process.env.TIMEWEB_DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: false,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
