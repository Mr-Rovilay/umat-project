// routes/courseRoutes.js
import express from 'express';
import {
  createCourse,
  getMyCourses,
  getAvailableCourses,
  registerCourses,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';

import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Admin route
router.post('/', protect, restrictTo('admin'), createCourse);
router.post('/update:id', protect, restrictTo('admin'), updateCourse);
router.delete('/delete:id', protect, restrictTo('admin'), deleteCourse);
router.get('/available', getAvailableCourses);

// Student routes
router.post('/register', protect, restrictTo('student'), registerCourses);
router.get('/my-courses', protect, restrictTo('student'), getMyCourses);

export default router;
