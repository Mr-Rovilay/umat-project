import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  semester: {
    type: String,
    enum: ['First Semester', 'Second Semester'],
    required: true,
  },
  type: {
    type: String,
    enum: ['courseRegistrationSlip', 'schoolFeesReceipt', 'departmentalDuesReceipt'],
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fs.files',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Upload', uploadSchema);