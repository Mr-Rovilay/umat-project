import express from 'express';
import { getDashboardAnalytics, getDashboardStats } from '../controllers/adminDashboardController.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, restrictTo("admin"), getDashboardAnalytics); // Get dashboard analytics
router.get('/stats', protect, restrictTo('admin'), getDashboardStats);

export default router;