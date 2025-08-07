import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const registerStudent = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, referenceNumber } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    
    const student = await User.create({
      role: 'student',
      email,
      password: hashed,
      firstName,
      lastName,
      phone,
      referenceNumber,
      isRegistered: true,
    });

    generateToken(res, student._id);
    
    res.status(201).json({
      _id: student._id,
      email: student.email,
      role: student.role,
      firstName: student.firstName,
      isRegistered: student.isRegistered,
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message || "Server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    generateToken(res, user._id);
    
    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Server error during login" });
  }
};

export const getUser = async (req, res) => {
  try {
    // Find user by ID, exclude password, and populate referenced fields
const user = await User.findById(req.user.id)
  .select('-password')
  .populate({
    path: 'courses',
    select: 'title code unit semester program',
    populate: {
      path: 'program',
      select: 'name degree department',
      populate: {
        path: 'department',
        select: 'name'
      }
    }
  });


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/stats/registered-students
export const getTotalRegisteredStudents = async (req, res) => {
  try {
    const total = await User.countDocuments({ isRegistered: true });

const result = await User.aggregate([
  { $match: { isRegistered: true } },
  { $unwind: "$courses" }, // explode array of courses
  {
    $lookup: {
      from: "courses",
      localField: "courses",
      foreignField: "_id",
      as: "courseInfo"
    }
  },
  { $unwind: "$courseInfo" },
  {
    $lookup: {
      from: "programs",
      localField: "courseInfo.program",
      foreignField: "_id",
      as: "programInfo"
    }
  },
  { $unwind: "$programInfo" },
  {
    $lookup: {
      from: "departments",
      localField: "programInfo.department",
      foreignField: "_id",
      as: "departmentInfo"
    }
  },
  { $unwind: "$departmentInfo" },
  {
    $group: {
      _id: "$departmentInfo._id",
      departmentName: { $first: "$departmentInfo.name" },
      count: { $sum: 1 }
    }
  }
]);
    res.json({ total, result });
  } catch (err) {
    console.error('Error fetching student count:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ 
      message: 'Server error while changing password' 
    });
  }
};
