// controllers/departmentController.js
import Department from '../models/Department.js';
import Program from '../models/Program.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { name, programs, admins } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    // Validate admin access
    const user = await User.findById(req.user._id).populate('department', 'name');
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create departments' });
    }

    // Validate program IDs if provided
    if (programs && !programs.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid program ID(s)' });
    }

    // Validate admin IDs if provided
    if (admins && !admins.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid admin ID(s)' });
    }

    const department = new Department({ name, programs, admins });
    await department.save();

    // Update admins' department array
    if (admins && admins.length > 0) {
      await User.updateMany(
        { _id: { $in: admins } },
        { $addToSet: { department: department._id } }
      );
    }

    const populatedDepartment = await Department.findById(department._id)
      .populate('admins', 'firstName lastName email')
      .populate('programs', 'name degree');
    res.status(201).json({ message: 'Department created successfully', department: populatedDepartment });
  } catch (error) {
    console.error('Create department error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Department name already exists' });
    }
    res.status(500).json({ message: 'Server error while creating department' });
  }
};

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).populate('department', 'name');
    const departmentIds = user?.department?.map(d => d._id.toString()) || [];
    const query = user?.role === 'admin' && departmentIds.length > 0 ? { _id: { $in: departmentIds } } : {};

    const departments = await Department.find(query)
      .populate('admins', 'firstName lastName email')
      .populate('programs', 'name degree');
    res.status(200).json({ departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error while fetching departments' });
  }
};

// Get a single department by ID
export const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const user = await User.findById(req.user._id).populate('department', 'name');
    if (user.role === 'admin' && !user.department.some(d => d._id.toString() === id)) {
      return res.status(403).json({ message: 'You are not authorized to access this department' });
    }

    const department = await Department.findById(id)
      .populate('admins', 'firstName lastName email')
      .populate('programs', 'name degree');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ department });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error while fetching department' });
  }
};

// Update a department by ID
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, programs, admins } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const user = await User.findById(req.user._id).populate('department', 'name');
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update departments' });
    }
    if (!user.department.some(d => d._id.toString() === id)) {
      return res.status(403).json({ message: 'You are not authorized to update this department' });
    }

    if (programs && !programs.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid program ID(s)' });
    }

    if (admins && !admins.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid admin ID(s)' });
    }

    const department = await Department.findByIdAndUpdate(
      id,
      { name, programs, admins },
      { new: true, runValidators: true }
    )
      .populate('admins', 'firstName lastName email')
      .populate('programs', 'name degree');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Update admins' department array
    if (admins && admins.length > 0) {
      await User.updateMany(
        { _id: { $in: admins } },
        { $addToSet: { department: department._id } }
      );
      // Remove department from users not in the updated admins list
      await User.updateMany(
        { department: department._id, _id: { $nin: admins } },
        { $pull: { department: department._id } }
      );
    }

    res.status(200).json({ department });
  } catch (error) {
    console.error('Update department error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Department name already exists' });
    }
    res.status(500).json({ message: 'Server error while updating department' });
  }
};

// Delete a department by ID
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const user = await User.findById(req.user._id).populate('department', 'name');
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete departments' });
    }
    if (!user.department.some(d => d._id.toString() === id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this department' });
    }

    // Check for dependent programs
    const programs = await Program.find({ department: id });
    if (programs.length > 0) {
      return res.status(400).json({ message: 'Cannot delete department with associated programs' });
    }

    // Check for dependent courses
    const courses = await Course.find({ department: id });
    if (courses.length > 0) {
      return res.status(400).json({ message: 'Cannot delete department with associated courses' });
    }

    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Remove department from users
    await User.updateMany(
      { department: id },
      { $pull: { department: id } }
    );

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error while deleting department' });
  }
};