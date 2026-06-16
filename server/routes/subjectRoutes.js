import express from 'express';
import { createSubject, getSubjects, updateSubject, deleteSubject } from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get all active subjects (accessible by all authenticated users)
router.get('/', protect, getSubjects);

// Create subject (ADMIN only)
router.post('/', protect, requireAdmin, createSubject);

// Update subject (ADMIN only)
router.put('/:id', protect, requireAdmin, updateSubject);

// Soft delete subject (ADMIN only)
router.delete('/:id', protect, requireAdmin, deleteSubject);

export default router;
