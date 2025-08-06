import express from 'express';
import { registerStudent, login, logout, getUser, getTotalRegisteredStudents } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.get('/user', protect, getUser);
router.post('/logout', logout);
router.get('/admin/stats/registered-students',  protect, restrictTo('admin'), getTotalRegisteredStudents);

export default router;
