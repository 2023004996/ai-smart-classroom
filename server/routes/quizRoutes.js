import express from 'express';
import { getWarmupQuiz, submitWarmupQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/warmup', protect, getWarmupQuiz);
router.post('/submit', protect, submitWarmupQuiz);

export default router;
