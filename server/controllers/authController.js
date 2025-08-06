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
    });

    generateToken(res, student._id);
    
    res.status(201).json({
      _id: student._id,
      email: student.email,
      role: student.role,
      firstName: student.firstName,
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
      .populate('department', 'name') // Populate department name (adjust field as needed)
      .populate('program', 'name')   // Populate program name (adjust field as needed)
      .populate('courses', 'title code'); // Populate course title and code

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