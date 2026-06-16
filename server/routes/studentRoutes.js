import express from 'express';
import { getDashboard, updatePerformanceScore, getStudentCategory } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireStudent } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, requireStudent, getDashboard);
router.post('/update-performance', protect, requireStudent, updatePerformanceScore);
router.get('/category', protect, requireStudent, getStudentCategory);

export default router;
