import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/user.model.js';
import connectDB from './src/db/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if the default admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@zorvyn.com' });
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seeding.');
      process.exit(0);
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create the admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@zorvyn.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user seeded successfully!');
    console.log('-----------------------------------');
    console.log(`Email:    ${adminUser.email}`);
    console.log(`Password: admin123`);
    console.log(`Role:     ${adminUser.role}`);
    console.log('-----------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
