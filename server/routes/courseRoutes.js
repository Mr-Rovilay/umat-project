// routes/courseRoutes.js
import express from 'express';
import multer from "multer";
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

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage to get buffer
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs only
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed!'), false);
    }
  }
});

// In your routes
router.post('/register', 
  protect, 
  restrictTo('student'), 
  upload.fields([
    { name: 'courseRegistrationSlip', maxCount: 1 },
    { name: 'schoolFeesReceipt', maxCount: 1 },
    { name: 'hallDuesReceipt', maxCount: 1 }
  ]), 
  registerCourses
);

router.post('/', protect, restrictTo('admin'), createCourse);
router.put('/:id', protect, restrictTo('admin'), updateCourse);
router.delete('/:id', protect, restrictTo('admin'), deleteCourse);
router.get('/available', getAvailableCourses);
router.get('/my-courses', protect, restrictTo('student'), getMyCourses);

export default router;