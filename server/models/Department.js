// models/Department.js
import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    programs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
    },
    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

const Department = mongoose.model('Department', departmentSchema);
export default Department;