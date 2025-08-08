import Department from '../models/Department.js';
import mongoose from 'mongoose';
import Program from '../models/Program.js';
import Course from '../models/Course.js';

// Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { name, programs } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    // Validate program IDs if provided
    // if (programs && !programs.every(id => mongoose.isValidObjectId(id))) {
    //   return res.status(400).json({ message: 'Invalid program ID(s)' });
    // }

    const department = new Department({ name, programs });
    await department.save();

    // Populate programs for response
    // const populatedDepartment = await Department.find();
    res.status(201).json({ message: 'Department created successfully'});
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
    const departments = await Department.find();
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

    // Validate department ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const department = await Department.findById(id).populate('programs', 'name degree');
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
    const { name, programs } = req.body;

    // Validate department ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    // Validate program IDs if provided
    if (programs && !programs.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid program ID(s)' });
    }

    const department = await Department.findByIdAndUpdate(
      id,
      { name, programs },
      { new: true, runValidators: true }
    )

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
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

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
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

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error while deleting department' });
  }
};