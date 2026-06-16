import express from 'express';
import { getWarmupQuiz, submitWarmupQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireStudent } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/warmup', protect, requireStudent, getWarmupQuiz);
router.post('/submit', protect, requireStudent, submitWarmupQuiz);

export default router;
