import express from 'express';
import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
  getPaymentHistory
} from '../controllers/paymentController.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public webhook route (no auth needed)
router.post('/webhook/paystack', paystackWebhook);

// Protected routes
router.use(protect);

// Student payment routes
router.post('/initialize', restrictTo('student'), initializePayment);
router.get('/verify/:reference', restrictTo('student'), verifyPayment);
router.get('/history',protect, restrictTo('student'), getPaymentHistory);

export default router;