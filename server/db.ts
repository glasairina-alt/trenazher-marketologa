import { Pool } from 'pg';

// Encode password to handle special characters
const encodePassword = (password: string) => {
  return encodeURIComponent(password);
};

// Validate required environment variables
const requiredEnvVars = [
  'TIMEWEB_DB_USER',
  'TIMEWEB_DB_PASSWORD',
  'TIMEWEB_DB_HOST',
  'TIMEWEB_DB_PORT',
  'TIMEWEB_DB_NAME'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}

const password = process.env.TIMEWEB_DB_PASSWORD!;
const encodedPassword = encodePassword(password);

// Use connection string with properly encoded password
const connectionString = `postgresql://${process.env.TIMEWEB_DB_USER}:${encodedPassword}@${process.env.TIMEWEB_DB_HOST}:${process.env.TIMEWEB_DB_PORT}/${process.env.TIMEWEB_DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: false, // Timeweb doesn't require SSL for internal connections
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
});

// Test connection on startup
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Database connected successfully');
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
