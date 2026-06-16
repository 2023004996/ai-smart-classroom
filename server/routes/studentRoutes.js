import express from 'express';
import { getDashboard, updatePerformanceScore, getStudentCategory } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.post('/update-performance', protect, updatePerformanceScore);
router.get('/category', protect, getStudentCategory);

export default router;
