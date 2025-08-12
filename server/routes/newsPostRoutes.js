// routes/newsRoutes.js (unchanged)
import express from 'express';
import {
  createNewsPost,
  getNewsPosts,
  likeNewsPost,
  commentNewsPost,
  reactNewsPost,
  editNewsPost,
  deleteNewsPost,
} from '../controllers/newsPostController.js';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const router = express.Router();

// Admin routes
router.post('/', protect,  upload.array('images', 5), createNewsPost); // Create news post with up to 5 images
router.put('/:id', protect, restrictTo('admin'), upload.array('images', 5), editNewsPost); // Edit news post
router.delete('/:id', protect, restrictTo('admin'), deleteNewsPost); // Delete news post

// Student routes
router.get('/', protect, getNewsPosts); // Get news posts by department
router.post('/:id/like', protect, restrictTo('student'), likeNewsPost); // Like/unlike a post
router.post('/:id/comment', protect, restrictTo('student'), commentNewsPost); // Comment on a post
router.post('/:id/react', protect, restrictTo('student'), reactNewsPost); // React to a post

export default router;