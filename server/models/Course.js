// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  unit: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6], // Fixed enum syntax for unit
    required: true,
  },
  semester: {
    type: String,
    enum: ['First Semester', 'Second Semester'], // Fixed enum syntax for semester
    required: true,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
  },
  level: {
    type: String,
    enum: ['100', '200', '300', '400', '500'], // Fixed enum syntax for level
    required: true,
  },
});

const Course = mongoose.model('Course', courseSchema);
export default Course;