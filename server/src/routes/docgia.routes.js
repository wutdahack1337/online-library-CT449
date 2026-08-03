import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getAllDocGia, createDocGia, updateDocGia, setActiveDocGia } from '../controllers/docgia.controller.js';

const router = Router();
router.use(requireAuth); // toàn bộ CRUI docgia chỉ NhanVien xem/sửa
router.get('/', getAllDocGia);
router.post('/', createDocGia);
router.put('/:id', updateDocGia);
router.patch('/:id/active', setActiveDocGia);

export default router;