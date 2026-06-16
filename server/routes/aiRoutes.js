import express from 'express';
import { chat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireStudent } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/chat', protect, requireStudent, chat);

export default router;
