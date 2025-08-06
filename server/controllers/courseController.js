import Course from '../models/Course.js';
import CourseRegistration from '../models/CourseRegistration.js';
import Program from '../models/Program.js';
import mongoose from 'mongoose';

// Admin creates a course (single or bulk)
export const createCourse = async (req, res) => {
  try {
    // Handle bulk creation
    if (Array.isArray(req.body)) {
      // Validate all courses
      for (const course of req.body) {
        const { title, code, department, unit, semester, program, level } = course;
        if (!title || !code || !unit || !semester || !program || !level) {
          return res.status(400).json({ message: 'All required fields (title, code, unit, semester, program, level) must be provided for each course' });
        }
        if (!mongoose.isValidObjectId(program) || (department && !mongoose.isValidObjectId(department))) {
          return res.status(400).json({ message: 'Invalid program or department ID' });
        }
      }

      // Check for duplicate course codes in the request
      const codes = req.body.map(c => c.code);
      const uniqueCodes = [...new Set(codes)];
      if (codes.length !== uniqueCodes.length) {
        return res.status(400).json({ message: 'Duplicate course codes found in the request' });
      }

      // Check for existing courses in the database
      const existingCourses = await Course.find({ code: { $in: codes } });
      if (existingCourses.length > 0) {
        const existingCodes = existingCourses.map(c => c.code);
        return res.status(409).json({ message: `Courses with codes [${existingCodes.join(', ')}] already exist` });
      }

      // Validate program existence
      const programs = await Program.find({ _id: { $in: req.body.map(c => c.program) } });
      if (programs.length !== new Set(req.body.map(c => c.program)).size) {
        return res.status(400).json({ message: 'One or more program IDs are invalid' });
      }

      // Create courses
      const newCourses = await Course.insertMany(req.body);
      const populatedCourses = await Course.find({ _id: { $in: newCourses.map(c => c._id) } })
        .populate('program', 'name degree')
        .populate('department', 'name');
      return res.status(201).json({
        message: 'Courses created successfully',
        courses: populatedCourses,
      });
    }

    // Single course creation
    const { title, code, description, department, unit, semester, program, level } = req.body;

    // Validate required fields
    if (!title || !code || !unit || !semester || !program || !level) {
      return res.status(400).json({ message: 'All required fields (title, code, unit, semester, program, level) must be provided' });
    }

    // Validate ObjectIds
    if (!mongoose.isValidObjectId(program) || (department && !mongoose.isValidObjectId(department))) {
      return res.status(400).json({ message: 'Invalid program or department ID' });
    }

    // Check for duplicate course code
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(409).json({ message: `Course with code "${code}" already exists` });
    }

    // Validate program existence
    const programExists = await Program.findById(program);
    if (!programExists) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    // Create new course
    const newCourse = await Course.create({
      title,
      code,
      description,
      department,
      unit,
      semester,
      program,
      level,
    });

    const populatedCourse = await Course.findById(newCourse._id)
       .populate({
        path: 'program',
        select: 'name degree department',
        populate: {
          path: 'department',
          select: 'name' // Add more fields if needed
        }
      });

    res.status(201).json({
      message: 'Course created successfully',
      course: populatedCourse,
    });
  } catch (error) {
    console.error('Create Course Error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: `Course with code "${req.body.code || req.body[0]?.code}" already exists` });
    }
    res.status(500).json({ message: 'Server error while creating course(s)' });
  }
};

export const getAvailableCourses = async (req, res) => {
  try {
    const { program, level, semester } = req.query;
    const query = {};
    if (program) query.program = program;
    if (level) query.level = level;
    if (semester) query.semester = semester;

    // Validate ObjectId for program if provided
    if (program && !mongoose.isValidObjectId(program)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    const courses = await Course.find(query)
      .populate({
        path: 'program',
        select: 'name degree department',
        populate: {
          path: 'department',
          select: 'name' // Add more fields if needed
        }
      });

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
};

// Student: Register for courses
export const registerCourses = async (req, res) => {
  try {
    const { program, level, semester, courseIds } = req.body;
    const studentId = req.user._id;

    // Validate input
    if (!program || !level || !semester || !courseIds || !Array.isArray(courseIds)) {
      return res.status(400).json({ message: 'Program, level, semester, and courseIds array are required' });
    }

    // Validate ObjectIds
    if (!mongoose.isValidObjectId(program) || !courseIds.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid program or course ID(s)' });
    }

    // Validate program and level
    const programExists = await Program.findById(program);
    if (!programExists) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }
    if (!['100', '200', '300', '400', '500'].includes(level)) {
      return res.status(400).json({ message: 'Invalid level' });
    }
    if (!['First Semester', 'Second Semester'].includes(semester)) {
      return res.status(400).json({ message: 'Invalid semester' });
    }

    // Check if student already registered for this semester
    const existingRegistration = await CourseRegistration.findOne({
      student: studentId,
      program,
      level,
      semester,
    });
    if (existingRegistration) {
      return res.status(409).json({ message: 'You have already registered for courses this semester' });
    }

    // Verify all course IDs exist and match program, level, and semester
    const courses = await Course.find({ _id: { $in: courseIds }, program, level, semester });
    if (courses.length !== courseIds.length) {
      return res.status(400).json({ message: 'One or more course IDs are invalid or do not match the program, level, or semester' });
    }

    // Check total units (e.g., max 24 units)
    const totalUnits = courses.reduce((sum, course) => sum + course.unit, 0);
    if (totalUnits > 24) {
      return res.status(400).json({ message: `Total units (${totalUnits}) exceed maximum allowed (24)` });
    }

    // Create registration
    const registration = await CourseRegistration.create({
      student: studentId,
      program,
      level,
      semester,
      courses: courseIds,
    });

    const populatedRegistration = await CourseRegistration.findById(registration._id)
      .populate('courses', 'title code unit semester')
      .populate('program', 'name degree');

    res.status(201).json({
      message: 'Courses registered successfully',
      registration: populatedRegistration,
    });
  } catch (error) {
    console.error('Course Registration Error:', error);
    res.status(500).json({ message: 'Server error during course registration' });
  }
};

// Student: Get own registered courses
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const registrations = await CourseRegistration.find({ student: studentId })
      .populate('courses', 'title code unit semester')
      .populate('program', 'name degree')
      .sort({ createdAt: -1 });

    res.status(200).json({ registrations });
  } catch (error) {
    console.error('Get My Courses Error:', error);
    res.status(500).json({ message: 'Server error while fetching your courses' });
  }
};

// Admin: Update a course by ID
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, description, department, unit, semester, program, level } = req.body;

    // Validate course ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Validate provided ObjectIds
    if (program && !mongoose.isValidObjectId(program)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }
    if (department && !mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    // Check for duplicate course code if provided
    if (code) {
      const existingCourse = await Course.findOne({ code, _id: { $ne: id } });
      if (existingCourse) {
        return res.status(409).json({ message: `Course with code "${code}" already exists` });
      }
    }

    // Validate program existence if provided
    if (program) {
      const programExists = await Program.findById(program);
      if (!programExists) {
        return res.status(400).json({ message: 'Invalid program ID' });
      }
    }

    // Update course
    const course = await Course.findByIdAndUpdate(
      id,
      { title, code, description, department, unit, semester, program, level },
      { new: true, runValidators: true }
    )
      .populate('program', 'name degree')
      .populate('department', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    console.error('Update Course Error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: `Course with code "${req.body.code}" already exists` });
    }
    res.status(500).json({ message: 'Server error while updating course' });
  }
};

// Admin: Delete a course by ID
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate course ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Check for active registrations
    const registrations = await CourseRegistration.find({ courses: id });
    if (registrations.length > 0) {
      return res.status(400).json({ message: 'Cannot delete course with active registrations' });
    }

    // Delete course
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({ message: 'Server error while deleting course' });
  }
};