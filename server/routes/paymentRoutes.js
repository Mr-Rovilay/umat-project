import express from 'express';
import { initializePayment, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initialize', protect, initializePayment); // Initialize payment
router.get('/verify', protect, verifyPayment); // Verify payment

export default router;