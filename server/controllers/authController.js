// controllers/authController.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const registerStudent = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, referenceNumber, department, program, level } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });
    
    const student = await User.create({
      role: 'student',
      email,
      password,
      firstName,
      lastName,
      phone,
      referenceNumber,
      department: department ? [department] : [],
      program: program ? [program] : [], // Store as array for consistency
      level,
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
    const { email, password, secretKey } = req.body;
    
    const user = await User.findOne({ email }).select('+password +secretKey');
    if (!user) return res.status(401).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    if (user.role === 'admin') {
      if (!secretKey || !(await bcrypt.compare(secretKey, user.secretKey))) {
        return res.status(401).json({ message: 'Invalid admin secret key' });
      }
    }

    await User.findByIdAndUpdate(user._id, { isOnline: true });
    global.io.emit('activeStudents', await User.countDocuments({ isOnline: true, role: 'student' }));

    generateToken(res, user._id);
    
    const redirectUrl = user.role === 'admin' ? '/dashboard' : '/student/dashboard';
    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      redirectUrl,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Server error during login" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
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
      })
      .populate('program', 'name degree')
      .populate('department', 'name')
      .populate('paymentHistory');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { phone, email } = req.body;
    const userId = req.user._id;

    if (!phone && !email) {
      return res.status(400).json({ message: 'At least one field (phone or email) is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    if (phone) {
      user.phone = phone;
    }

    await user.save();

    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('program', 'name degree')
      .populate('department', 'name')
      .populate('paymentHistory');

    res.status(200).json({ user: updatedUser, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

export const getTotalRegisteredStudents = async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const query = { isRegistered: true, role: 'student' };
    if (departmentId) {
      query.department = departmentId;
    }

    const totalRegistered = await User.countDocuments(query);
    const onlineStudents = await User.countDocuments({ ...query, isOnline: true });
    const byDepartment = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "departmentInfo"
        }
      },
      { $unwind: { path: "$departmentInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$departmentInfo._id",
          departmentName: { $first: "$departmentInfo.name" },
          registeredCount: { $sum: 1 },
          onlineCount: { $sum: { $cond: [{ $eq: ["$isOnline", true] }, 1, 0] } },
          totalPaid: { $sum: { $arrayElemAt: ["$paymentHistory.amount", 0] } }
        }
      },
      {
        $sort: { departmentName: 1 }
      }
    ]);

    res.json({ totalRegistered, onlineStudents, byDepartment });
  } catch (err) {
    console.error('Error fetching student count:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Just set the plain password - the pre-save hook will hash it
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};