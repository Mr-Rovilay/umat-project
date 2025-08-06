import axios from 'axios';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Initialize payment with Paystack
export const initializePayment = async (req, res) => {
  try {
    const { amount, department } = req.body;
    const userId = req.user._id;

    if (!amount || !department) {
      return res.status(400).json({ message: 'Amount and department are required' });
    }
    if (!mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const user = await User.findById(userId);
    if (!user.department.includes(department)) {
      return res.status(400).json({ message: 'User is not part of the specified department' });
    }

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: amount * 100, // Paystack expects amount in kobo
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const payment = await Payment.create({
      user: userId,
      department,
      amount,
      reference: response.data.data.reference,
      status: 'pending',
    });

    res.status(200).json({
      message: 'Payment initialized successfully',
      authorizationUrl: response.data.data.authorization_url,
      payment,
    });
  } catch (error) {
    console.error('Initialize Payment Error:', error);
    res.status(500).json({ message: 'Server error while initializing payment' });
  }
};

// Verify payment with Paystack
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) {
      return res.status(400).json({ message: 'Payment reference is required' });
    }

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = response.data.data.status === 'success' ? 'success' : 'failed';
    await payment.save();

    res.status(200).json({
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: 'Server error while verifying payment' });
  }
};