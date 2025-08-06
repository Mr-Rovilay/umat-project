import Program from '../models/Program.js';
import mongoose from 'mongoose';

// Create a new program
export const createProgram = async (req, res) => {
  try {
    const { name, department, duration, degree } = req.body;

    // Validate required fields
    if (!name || !department || !degree) {
      return res.status(400).json({ message: 'Name, department, and degree are required' });
    }

    // Validate department ID
    if (!mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const program = new Program({ name, department, duration, degree });
    await program.save();

    // Populate department for response
    const populatedProgram = await Program.findById(program._id).populate('department', 'name');
    res.status(201).json({ program: populatedProgram });
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({ message: 'Server error while creating program' });
  }
};

// Get all programs
export const getAllPrograms = async (req, res) => {
  try {
    const { department } = req.query;
    const query = department ? { department } : {};

    // Validate department ID if provided
    if (department && !mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const programs = await Program.find(query).populate('department', 'name');
    res.status(200).json({ programs });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ message: 'Server error while fetching programs' });
  }
};

// Get a single program by ID
export const getProgram = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate program ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    const program = await Program.findById(id).populate('department', 'name');
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({ program });
  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({ message: 'Server error while fetching program' });
  }
};

// Update a program by ID
export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, duration, degree } = req.body;

    // Validate program ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    // Validate department ID if provided
    if (department && !mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const program = await Program.findByIdAndUpdate(
      id,
      { name, department, duration, degree },
      { new: true, runValidators: true }
    ).populate('department', 'name');

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({ program });
  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({ message: 'Server error while updating program' });
  }
};

// Delete a program by ID
export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate program ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    const program = await Program.findByIdAndDelete(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({ message: 'Server error while deleting program' });
  }
};