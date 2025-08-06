import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    duration: {
      enum: ['3 years', '4 years', '5 years'],
      type: String,
    },
    degree: {
        type: String,
        enum: ['Bachelor', 'Master', 'PhD'],
        required: true,
    },
  },
  { timestamps: true }, 
);

const Program = mongoose.model('Program', programSchema);
export default Program;
