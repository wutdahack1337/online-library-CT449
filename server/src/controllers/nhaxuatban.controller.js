import  NhaXuatBan  from '../models/NhaXuatBan.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllNXB = asyncHandler(async (req, res) => {
  res.json(await NhaXuatBan.find({ active: true }));
});

export const createNXB = asyncHandler(async (req, res) => {
  res.status(201).json(await NhaXuatBan.create(req.body));
});

export const updateNXB = asyncHandler(async (req, res) => {
  const nxb = await NhaXuatBan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!nxb) { const e = new Error('Không tìm thấy NXB'); e.status = 404; throw e; }
  res.json(nxb);
});

export const setActiveNXB = asyncHandler(async (req, res) => {
  const nxb = await NhaXuatBan.findByIdAndUpdate(req.params.id, { active: req.body.active }, { new: true });
  if (!nxb) { const e = new Error('Không tìm thấy NXB'); e.status = 404; throw e; }
  res.json(nxb);
});