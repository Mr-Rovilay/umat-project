// routes/departmentAdminRoutes.js
import express from 'express';
import {
  getDepartmentRegistrationStats,
  getDepartmentStudentRegistrations,
  verifyStudentDocuments,
  getStudentRegistrationDetails,
  fetchAdminDepartments,
  getDepartmentOnlineStudentsCount
} from '../controllers/departmentAdminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictToDepartmentAdmin } from '../middleware/roleMiddleware.js';


const router = express.Router();

// All routes require department admin privileges
router.use(protect);
router.use(restrictToDepartmentAdmin);

// Get department registration statistics
router.get('/stats', getDepartmentRegistrationStats);

// Get student registrations in this department
router.get('/registrations', getDepartmentStudentRegistrations);

router.get('/online-students-count', getDepartmentOnlineStudentsCount);

// Verify student documents
router.post('/verify-documents', verifyStudentDocuments);

// Get student registration details
router.get('/registration/:registrationId', getStudentRegistrationDetails);
router.post('/departments', fetchAdminDepartments);

export default router;