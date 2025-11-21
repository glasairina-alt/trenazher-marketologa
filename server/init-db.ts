import pool from './db';

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Creating schema and tables...');
    
    // Create schema
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS trainer_marketing;
    `);
    
    console.log('✅ Schema trainer_marketing created');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trainer_marketing.users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Table users created');
    
    // Create index on email for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email 
      ON trainer_marketing.users(email);
    `);
    
    console.log('✅ Index on email created');
    
    // Create updated_at trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION trainer_marketing.update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON trainer_marketing.users;
      
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON trainer_marketing.users
      FOR EACH ROW
      EXECUTE FUNCTION trainer_marketing.update_updated_at_column();
    `);
    
    console.log('✅ Updated_at trigger created');
    
    console.log('🎉 Database initialization completed!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run initialization
initDatabase()
  .then(() => {
    console.log('Database setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
