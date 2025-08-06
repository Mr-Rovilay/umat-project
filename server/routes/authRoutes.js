import express from 'express';
import { registerStudent, login, logout, getUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.get('/user', protect, getUser);
router.post('/logout', logout);

export default router;
