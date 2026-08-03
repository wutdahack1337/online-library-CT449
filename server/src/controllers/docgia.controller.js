import DocGia from '../models/DocGia.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllDocGia = asyncHandler(async (req, res) => {
  res.json(await DocGia.find());
});

export const createDocGia = asyncHandler(async (req, res) => {
  const existed = await DocGia.findOne({ dienThoai: req.body.dienThoai });
  if (existed) { const e = new Error('Số điện thoại đã tồn tại'); e.status = 400; throw e; }
  res.status(201).json(await DocGia.create(req.body));
});

export const updateDocGia = asyncHandler(async (req, res) => {
  const dg = await DocGia.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!dg) { const e = new Error('Không tìm thấy độc giả'); e.status = 404; throw e; }
  res.json(dg);
});

export const setActiveDocGia = asyncHandler(async (req, res) => {
  const dg = await DocGia.findByIdAndUpdate(req.params.id, { active: req.body.active }, { new: true });
  if (!dg) { const e = new Error('Không tìm thấy độc giả'); e.status = 404; throw e; }
  res.json(dg);
});