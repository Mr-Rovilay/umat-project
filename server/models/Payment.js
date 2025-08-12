import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseRegistration',
    required: true
  },
  semester: { 
    type: String, 
    enum: ['First Semester', 'Second Semester'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  paymentType: { 
    type: String, 
    enum: ['school_fees', 'departmental_dues', 'hall_dues'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'successful', 'failed'], 
    default: 'pending' 
  },
  transactionId: { 
    type: String,
    unique: true,
    sparse: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  paystackData: {
    authorization: mongoose.Schema.Types.Mixed,
    customer: mongoose.Schema.Types.Mixed,
    plan: mongoose.Schema.Types.Mixed
  },
  receiptUrl: {
    type: String
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});


export default mongoose.model('Payment', paymentSchema);