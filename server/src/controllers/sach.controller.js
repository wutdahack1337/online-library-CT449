import { asyncHandler } from '../utils/asyncHandler.js';
import { getIO } from '../sockets/io.js';
import  Sach  from '../models/Sach.js';
import  NhaXuatBan  from '../models/NhaXuatBan.js';

export const getAllSach = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { active: true };
  const list = await Sach.find(filter).populate('maNXB', 'tenNhaXuatBan');
  res.json(list);
});

export const getOneSach = asyncHandler(async (req, res) => {
    const sach = await Sach.findById(req.params.id).populate('maNXB', 'tenNhaXuatBan');
    if (!sach) { const e = new Error('Không tìm thấy sách'); e.status = 404; throw e; }
    res.json(sach);
});

export const searchSach = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const result = await Sach.aggregate([
    { $match: { active: true } },
    { $lookup: { from: 'nhaxuatbans', localField: 'maNXB', foreignField: '_id', as: 'nxb' } },
    { $unwind: '$nxb' },
    { $match: { $or: [
      { tenSach: { $regex: q, $options: 'i' } },
      { tacGia: { $regex: q, $options: 'i' } },
      { 'nxb.tenNhaXuatBan': { $regex: q, $options: 'i' } }
    ]}}
  ]);
  res.json(result);
});

export const createSach = asyncHandler(async (req, res) => {
  const nxb = await NhaXuatBan.findById(req.body.maNXB);
  if (!nxb) { const e = new Error('NXB không tồn tại'); e.status = 400; throw e; }
  const sach = await Sach.create(req.body);
  res.status(201).json(sach);
});

export const updateSach = asyncHandler(async (req, res) => {
  const sach = await Sach.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!sach) { const e = new Error('Không tìm thấy sách'); e.status = 404; throw e; }
  getIO().to('books').emit('book:updated', { maSach: sach.maSach, soQuyen: sach.soQuyen, active: sach.active });
  res.json(sach);
});

export const setActiveSach = asyncHandler(async (req, res) => {
  const { active } = req.body; // true | false
  const sach = await Sach.findByIdAndUpdate(req.params.id, { active }, { new: true });
  if (!sach) { const e = new Error('Không tìm thấy sách'); e.status = 404; throw e; }
  getIO().to('books').emit('book:updated', { maSach: sach.maSach, soQuyen: sach.soQuyen, active: sach.active });
  res.json(sach);
});