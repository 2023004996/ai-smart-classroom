import express from 'express';
import { dashboard } from '../controllers/classroomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, dashboard);

export default router;
