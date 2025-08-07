import express from 'express';
import { registerStudent, login, getUser, getTotalRegisteredStudents, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.get('/user', protect, getUser);
router.get("/logout", protect, (req, res) => {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", });
    res.status(201).json({ message: "Logged out successfully" });
  });

router.get('/admin/stats/registered-students',  protect, restrictTo('admin'), getTotalRegisteredStudents);
router.put('/change-password', protect, restrictTo("student"), changePassword);

export default router;
