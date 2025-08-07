import express from 'express';
import { registerStudent, login, getUser, getTotalRegisteredStudents, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.get('/user', protect, getUser);
router.post('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || true, // Force secure in dev for sameSite: "none"
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'none',
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/admin/stats/registered-students', protect, restrictTo('admin'), getTotalRegisteredStudents);
router.put('/change-password', protect, restrictTo('student'), changePassword);

export default router;