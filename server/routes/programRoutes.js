import express from 'express';
import {
  createProgram,
  getAllPrograms,
  getProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('admin'), createProgram); // Create a new program
router.get('/', getAllPrograms); // Get all programs (accessible to all for dropdowns)
router.get('/:id', getProgram); // Get a single program by ID
router.put('/:id', protect, restrictTo('admin'), updateProgram); // Update a program by ID
router.delete('/:id', protect, restrictTo('admin'), deleteProgram); // Delete a program by ID

export default router;