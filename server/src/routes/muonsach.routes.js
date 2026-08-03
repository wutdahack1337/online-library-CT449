import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getAllMuonSach, muonSach, traSach } from '../controllers/muonsach.controller.js';

const router = Router();
router.get('/', requireAuth, getAllMuonSach); // admin xem bảng theo dõi để trả sách
router.post('/', muonSach); // public — form đăng ký mượn sách
router.patch('/:id/tra', requireAuth, traSach);

export default router;