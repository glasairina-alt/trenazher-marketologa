import bcrypt from 'bcrypt';
import pool from './db';

const SALT_ROUNDS = 10;

async function seedUsers() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Seeding test users...');
    
    // Test users data
    const users = [
      {
        email: 'admin@test.com',
        password: 'admin123',
        name: 'Admin User',
        phone: '+79991234567',
        role: 'admin'
      },
      {
        email: 'premium@test.com',
        password: 'premium123',
        name: 'Premium User',
        phone: '+79991234568',
        role: 'premium_user'
      },
      {
        email: 'user@test.com',
        password: 'user123',
        name: 'Regular User',
        phone: '+79991234569',
        role: 'user'
      }
    ];
    
    for (const user of users) {
      // Check if user exists
      const existingUser = await client.query(
        'SELECT id FROM trainer_marketing.users WHERE email = $1',
        [user.email]
      );
      
      if (existingUser.rows.length > 0) {
        console.log(`⚠️ User ${user.email} already exists - skipping`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      
      // Insert user
      await client.query(
        `INSERT INTO trainer_marketing.users (email, password, name, phone, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.email, hashedPassword, user.name, user.phone, user.role]
      );
      
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }
    
    console.log('🎉 User seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    client.release();
  }
}

seedUsers()
  .then(() => {
    console.log('User seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('User seeding failed:', error);
    process.exit(1);
  });
