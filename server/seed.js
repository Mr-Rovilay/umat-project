import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Department from './models/Department.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedAdmins = async () => {
  try {
    await Department.updateMany(
      {},
      { $set: { admins: [] } }
    );
    
    // Define admin data
    const admins = [
      {
        firstName: 'Admin',
        lastName: 'One',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET1', 10),
        department: ['68933b957e68b2ca3e75d31e'],
      },
      {
        firstName: 'Admin3',
        lastName: 'One3',
        email: 'admin3@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET13', 10),
        department: ['68933a938fd0c35bb24a23ac'],
      },
      {
        firstName: 'Admin1',
        lastName: 'One',
        email: 'admin1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET11', 10),
        department: ['68933a778fd0c35bb24a23a8'],
      },
      {
        firstName: 'Admin2',
        lastName: 'One2',
        email: 'admin2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET12', 10),
        department: ['68933a288fd0c35bb24a23a4'],
      }
    ];

    // Create admins
    const createdAdmins = await User.insertMany(admins);

    // Create a mapping of department IDs to admin IDs
    const departmentAdminMap = {
      '68933b957e68b2ca3e75d31e': [createdAdmins[0]._id], // Admin One
      '68933a938fd0c35bb24a23ac': [createdAdmins[1]._id], // Admin3
      '68933a778fd0c35bb24a23a8': [createdAdmins[2]._id], // Admin1
      '68933a288fd0c35bb24a23a4': [createdAdmins[3]._id], // Admin2
    };

    // Update each department with its admin(s)
    for (const [departmentId, adminIds] of Object.entries(departmentAdminMap)) {
      const department = await Department.findById(departmentId);
      if (!department) {
        console.warn(`Department not found: ${departmentId}`);
        continue;
      }
      
      await Department.findByIdAndUpdate(
        departmentId,
        { $addToSet: { admins: { $each: adminIds } } }
      );
    }
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedAdmins();