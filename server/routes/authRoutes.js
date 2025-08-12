import express from 'express';
import { registerStudent, login, getUser, getTotalRegisteredStudents, changePassword, updateUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo, restrictToDepartment } from '../middleware/roleMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.put('/user', protect, updateUser);
router.get('/user', protect, getUser);
router.post('/logout', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isOnline: false }, { new: true });
  global.io.emit('activeStudents', await User.countDocuments({ isOnline: true, role: 'student' }));
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/admin/stats/registered-students/:departmentId', protect, restrictTo('admin'), restrictToDepartment, getTotalRegisteredStudents);
router.put('/change-password', protect, restrictTo('student'), changePassword);

export default router;