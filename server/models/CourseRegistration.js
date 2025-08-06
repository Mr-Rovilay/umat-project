// models/CourseRegistration.js
import mongoose from 'mongoose';

const courseRegistrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   program: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Program',
       required: true,
     },
  level: { type: String, required: true },
  semester: { type: String, enum: ['First Semester', 'Second Semester'], required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

const CourseRegistration = mongoose.model('CourseRegistration', courseRegistrationSchema);
export default CourseRegistration;
