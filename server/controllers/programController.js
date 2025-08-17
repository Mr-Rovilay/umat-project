import Program from '../models/Program.js';
import mongoose from 'mongoose';

// Create a new program
export const createProgram = async (req, res) => {
  try {
    const { name, department, duration, degree } = req.body;
    if (!name || !department || !degree) {
      return res.status(400).json({ message: 'Name, department, and degree are required' });
    }
    
    // Validate all department IDs in the array
    if (!Array.isArray(department) || department.some(id => !mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'All department IDs must be valid ObjectIds' });
    }
    
    const program = new Program({ name, department, duration, degree });
    await program.save();
    
    const populatedProgram = await Program.findById(program._id)
      .populate('department', 'name');
      
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
    let query = {};
    
    if (department) {
      if (!mongoose.isValidObjectId(department)) {
        return res.status(400).json({ message: 'Invalid department ID' });
      }
      // Find programs that include this department in their array
      query = { department: { $in: [department] } };
    }
    
    const programs = await Program.find(query)
      .populate({
        path: 'department',
        select: 'name admins',   // include name + admins
        populate: {
          path: 'admins',
          select: 'firstName lastName email role referenceNumber' // only pick needed fields
        }
      }).populate('courses', 'title code');
;
      
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
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }
    
    const program = await Program.findById(id)
           .populate({
        path: 'department',
        select: 'name admins',   // include name + admins
        populate: {
          path: 'admins',
          select: 'firstName lastName email role referenceNumber' // only pick needed fields
        }
      }) .populate('courses', 'title code');;
      
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
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }
    
    // Validate department IDs if provided
    if (department && (!Array.isArray(department) || department.some(id => !mongoose.isValidObjectId(id)))) {
      return res.status(400).json({ message: 'All department IDs must be valid ObjectIds' });
    }
    
    const updateData = { name, department, duration, degree, courses };
    // Remove undefined fields to avoid overwriting with null
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const program = await Program.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('department', 'name')
         .populate('courses', 'title code');
;
    
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