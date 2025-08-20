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
        firstName: 'Admin1',
        lastName: 'One',
        referenceNumber: 'ADMIN1',
        email: 'admin1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET1', 10),
        department: ['6899ebc1693e0d4bed3d9f9e'],
      },
      {
        firstName: 'Admin2',
        lastName: 'One3',
        referenceNumber: 'ADMIN2',
        email: 'admin2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET13', 10),
        department: ['689b0c3197f4407c07fd8ac0'],
      },
      {
        firstName: 'Admin3',
        lastName: 'One',
        referenceNumber: 'ADMIN3',
        email: 'admin3@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET11', 10),
        department: ['689b0d1497f4407c07fd8acb'],
      },
      {
        firstName: 'Admin4',
        lastName: 'One2',
        referenceNumber: 'ADMIN4',
        email: 'admin4@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET12', 10),
        department: ['689b0d2897f4407c07fd8acc'],
      },
         {
        firstName: 'Admin5',
        lastName: 'One2',
        referenceNumber: 'ADMIN5',
        email: 'admin5@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET12', 10),
        department: ['689b0d4097f4407c07fd8acd'],
      },

          {
        firstName: 'Yaw',
        lastName: 'Adjei',
        referenceNumber: 'ADMIN6',
        email: 'admin6@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET12', 10),
        department: ['68a0f0c43192ba549037ce32'],
      },

          {
        firstName: 'Kweku',
        lastName: 'Addo',
        referenceNumber: 'ADMIN7',
        email: 'admin7@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        secretKey: await bcrypt.hash('ADMINSECRET12', 10),
        department: ['68a0f1a13192ba549037ce33'],
      }
    ];

    // Create admins
    const createdAdmins = await User.insertMany(admins);

    // Create a mapping of department IDs to admin IDs
const departmentAdminMap = {
  '6899ebc1693e0d4bed3d9f9e': [createdAdmins[0]._id],
  '689b0c3197f4407c07fd8ac0': [createdAdmins[1]._id],
  '689b0d1497f4407c07fd8acb': [createdAdmins[2]._id],
  '689b0d2897f4407c07fd8acc': [createdAdmins[3]._id],
  '689b0d4097f4407c07fd8acd': [createdAdmins[4]._id],
  '68a0f0c43192ba549037ce32': [createdAdmins[5]._id],
  '68a0f1a13192ba549037ce33': [createdAdmins[6]._id],
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