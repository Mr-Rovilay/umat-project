// routes/adminDashboardRoutes.js
import express from 'express';
import { getDashboardAnalytics } from '../controllers/adminDashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo, restrictToDepartment } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, restrictTo('admin'), getDashboardAnalytics);

export default router;