// models/CourseRegistration.js

import mongoose from 'mongoose';

const courseRegistrationSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  program: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Program', 
    required: true 
  },
  level: { 
    type: String, 
    enum: ['100', '200', '300', '400', '500'], 
    required: true 
  },
  semester: { 
    type: String, 
    enum: ['First Semester', 'Second Semester'], 
    required: true 
  },
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  uploads: {
    courseRegistrationSlip: {
      url: { 
        type: String, 
        required: true 
      },
      publicId: { 
        type: String, 
        required: true 
      },
      verified: { 
        type: Boolean, 
        default: false 
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    schoolFeesReceipt: {
      url: { 
        type: String, 
        default: '' 
      },
      publicId: { 
        type: String, 
        default: '' 
      },
      verified: { 
        type: Boolean, 
        default: false 
      },
      uploadedAt: {
        type: Date
      }
    },
    hallDuesReceipt: {
      url: { 
        type: String, 
        default: '' 
      },
      publicId: { 
        type: String, 
        default: '' 
      },
      verified: { 
        type: Boolean, 
        default: false 
      },
      uploadedAt: {
        type: Date
      }
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'complete', 'failed'],
    default: 'pending'
  },
  payments: [{ // Make sure this is plural and is an array
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Payment' 
  }],
  paymentType: {
    type: String,
    enum: ['school_fees', 'hall_dues', null],
    default: null
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for total units
courseRegistrationSchema.virtual('totalUnits').get(function() {
  return this.courses.reduce((sum, course) => sum + (course.unit || 0), 0);
});

// Update lastUpdated timestamp before saving
courseRegistrationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Add index for better query performance
courseRegistrationSchema.index({ student: 1, semester: 1, level: 1 });
courseRegistrationSchema.index({ program: 1, semester: 1 });

export default mongoose.model('CourseRegistration', courseRegistrationSchema);