import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getAllSach, getOneSach, searchSach, createSach, updateSach, setActiveSach
} from '../controllers/sach.controller.js';

const router = Router();
router.get('/', getAllSach);
router.get('/search', searchSach);
router.get('/:id', requireAuth, getOneSach);
router.post('/', requireAuth, createSach);
router.put('/:id', requireAuth, updateSach);
router.patch('/:id/active', requireAuth, setActiveSach);

export default router;