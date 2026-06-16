import express from 'express';
import { getStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/stats', protect, requireAdmin, getStats);

export default router;
