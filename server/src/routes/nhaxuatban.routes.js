import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getAllNXB, createNXB, updateNXB, setActiveNXB } from '../controllers/nhaxuatban.controller.js';

const router = Router();
router.get('/', getAllNXB); // public: form Đăng ký mượn sách cần load NXB cho dropdown lọc, và admin form tạo Sách cũng cần
router.post('/', requireAuth, createNXB);
router.put('/:id', requireAuth, updateNXB);
router.patch('/:id/active', requireAuth, setActiveNXB);

export default router;