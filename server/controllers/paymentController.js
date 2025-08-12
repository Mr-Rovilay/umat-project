// controllers/paymentController.js
import axios from 'axios';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import CourseRegistration from '../models/CourseRegistration.js';
import User from '../models/User.js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL;

// Initialize payment
export const initializePayment = async (req, res) => {
  try {
    const { registrationId, amount, paymentType } = req.body;
    const studentId = req.user._id;
    
    console.log('Payment initialization request:', { registrationId, amount, paymentType, studentId });
    
    if (!registrationId || !amount || !paymentType) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID, amount, and payment type are required'
      });
    }
    
    // Find the registration
    const registration = await CourseRegistration.findOne({
      _id: registrationId,
      student: studentId
    }).populate('student', 'email firstName lastName');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }
    
    // Find existing payment for this registration and type
    let payment = await Payment.findOne({
      registration: registrationId,
      paymentType,
      status: 'pending'
    });
    
    if (!payment) {
      // Create a new payment if none exists
      const generatePaymentReference = () => {
        return `CR_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      };
      
      payment = new Payment({
        student: studentId,
        registration: registrationId,
        semester: registration.semester,
        amount,
        paymentType,
        reference: generatePaymentReference(),
        status: 'pending'
      });
      
      await payment.save();
    }
    
    const student = registration.student;
    
    // Prepare Paystack payload
    const paystackPayload = {
      email: student.email,
      amount: amount * 100, // Paystack expects amount in kobo
      reference: payment.reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      metadata: {
           student_id: studentId.toString(),
        registration_id: registrationId,
        payment_type: paymentType,
        student_name: `${student.firstName} ${student.lastName}`,
        semester: registration.semester,
        level: registration.level
      }
    };
    
console.log('Sending to Paystack:', paystackPayload);
    console.log('Paystack URL:', `${PAYSTACK_BASE_URL}/transaction/initialize`);
    
    // Initialize payment with Paystack
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      paystackPayload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Paystack response:', response.data);
    
    if (!response.data.status) {
      return res.status(400).json({
        success: false,
        message: 'Failed to initialize payment with Paystack',
        error: response.data.message
      });
    }
    
    // Update payment with Paystack data
    payment.paystackData = response.data.data;
    await payment.save();
    
    console.log('Updated payment:', payment);
    
    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        authorization_url: response.data.data.authorization_url,
        reference: payment.reference,
        access_code: response.data.data.access_code
      }
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing payment',
      error: error.response?.data?.message || error.message
    });
  }
}

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const studentId = req.user._id;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    // Find the payment
    const payment = await Payment.findOne({
      reference,
      student: studentId
    }).populate('registration');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify with Paystack
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { data } = response.data;

    if (!response.data.status || data.status !== 'success') {
      payment.status = 'failed';
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: {
          status: data.status,
          gateway_response: data.gateway_response
        }
      });
    }

    // Payment successful
    payment.status = 'successful';
    payment.transactionId = data.id;
    payment.verifiedAt = new Date();
    payment.paystackData = {
      ...payment.paystackData,
      verification_data: data
    };
    await payment.save();

    // Update registration based on payment type
    const registration = payment.registration;
    
    if (payment.paymentType === 'departmental_dues') {
      // For departmental dues, mark as complete
      registration.paymentStatus = 'complete';
      if (registration.uploads.hallDuesReceipt) {
        registration.uploads.hallDuesReceipt.verified = true;
      }
    } else if (payment.paymentType === 'school_fees') {
      // For school fees, mark as complete
      registration.paymentStatus = 'complete';
      if (registration.uploads.schoolFeesReceipt) {
        registration.uploads.schoolFeesReceipt.verified = true;
      }
    }

    await registration.save();

    // Update user's courses and owing status
    const user = await User.findById(studentId);
    user.courses = [...new Set([...user.courses, ...registration.courses])];
    user.owingStatus = await checkUserOwingStatus(studentId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment: {
          id: payment._id,
          amount: payment.amount,
          type: payment.paymentType,
          status: payment.status,
          reference: payment.reference,
          transactionId: payment.transactionId
        },
        registration: {
          id: registration._id,
          paymentStatus: registration.paymentStatus,
          semester: registration.semester,
          level: registration.level
        }
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.response?.data?.message || error.message
    });
  }
};

// Paystack webhook
export const paystackWebhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const { event, data } = req.body;

    if (event === 'charge.success') {
      const payment = await Payment.findOne({
        reference: data.reference
      }).populate('registration');

      if (payment) {
        payment.status = 'successful';
        payment.transactionId = data.id;
        payment.verifiedAt = new Date();
        payment.paystackData = {
          ...payment.paystackData,
          webhook_data: data
        };
        await payment.save();

        // Update registration
        const registration = payment.registration;
        if (registration) {
          registration.paymentStatus = 'complete';
          await registration.save();

          // Update user owing status
          const user = await User.findById(payment.student);
          if (user) {
            user.owingStatus = await checkUserOwingStatus(payment.student);
            await user.save();
          }
        }
      }
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { page = 1, limit = 10, semester, status } = req.query;

    const query = { student: studentId };
    if (semester) query.semester = semester;
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('registration', 'semester level program')
      .populate({
        path: 'registration',
        populate: {
          path: 'program',
          select: 'name degree'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_records: total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// Helper function to check user owing status
const checkUserOwingStatus = async (studentId) => {
  const pendingPayments = await Payment.countDocuments({
    student: studentId,
    status: 'pending'
  });
  
  return pendingPayments > 0;
};

export { checkUserOwingStatus };