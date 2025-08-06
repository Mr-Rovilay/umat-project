import express from 'express';
import { getDashboardAnalytics } from '../controllers/adminDashboardController.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, restrictTo("admin"), getDashboardAnalytics); // Get dashboard analytics

export default router;