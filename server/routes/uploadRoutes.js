// routes/uploadRoutes.js
import express from 'express';
import { getDocument, uploadCourseDocuments } from '../controllers/uploadController.js';
import multer from 'multer';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const router = express.Router();

router.post('/course-documents', protect, restrictTo('student'), upload.fields([
  { name: 'courseSlip', maxCount: 1 },
  { name: 'schoolFeesReceipt', maxCount: 1 },
  { name: 'departmentalDuesReceipt', maxCount: 1 },
]), uploadCourseDocuments);
// routes/uploadRoutes.js (update)
router.get('/document', protect, restrictTo(['student', 'admin']), getDocument);

export default router;