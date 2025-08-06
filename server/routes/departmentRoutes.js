import express from 'express';
import {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Define routes
router.post('/',protect, restrictTo('admin'), createDepartment); // Create a new department
router.get('/', getAllDepartments); // Get all departments
router.get('/:id', getDepartment); // Get a single department by ID
router.put('/:id',protect, restrictTo('admin'), updateDepartment); // Update a department by ID
router.delete('/:id',protect, restrictTo('admin'), deleteDepartment); // Delete a department by ID

export default router;