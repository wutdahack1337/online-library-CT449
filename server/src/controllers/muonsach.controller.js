import mongoose from 'mongoose';
import  DocGia  from '../models/DocGia.js';
import  Sach  from '../models/Sach.js';
import  TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getIO } from '../sockets/io.js';

export const getAllMuonSach = asyncHandler(async (req, res) => {
  const list = await TheoDoiMuonSach.find()
    .populate('maDocGia', 'hoTen dienThoai')
    .populate('maSach', 'tenSach')
    .sort({ ngayMuon: -1 });
  res.json(list);
});

export const muonSach = asyncHandler(async (req, res) => {
  const { docgiaInfo, maSach } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let docgia = await DocGia.findOne({ dienThoai: docgiaInfo.dienThoai }).session(session);
    if (!docgia) {
      docgia = (await DocGia.create([docgiaInfo], { session }))[0];
    }

    const soDangMuon = await TheoDoiMuonSach.countDocuments({
      maDocGia: docgia._id, ngayTra: null
    }).session(session);
    const maxBooks = Number(process.env.MAX_BOOKS_TO_BORROW) || 5;
    if (soDangMuon >= maxBooks) throw new Error('Đã đạt giới hạn ' + maxBooks + ' quyển đang mượn');

    const sach = await Sach.findOneAndUpdate(
      { _id: maSach, soQuyen: { $gt: 0 }, active: true },
      { $inc: { soQuyen: -1 } },
      { new: true, session }
    );
    if (!sach) throw new Error('Sách đã hết hoặc không tồn tại');

    const record = (await TheoDoiMuonSach.create(
      [{ maDocGia: docgia._id, maSach: sach._id }], { session }
    ))[0];

    await session.commitTransaction();
    getIO().to('books').emit('book:updated', { id: sach._id, soQuyen: sach.soQuyen, active: sach.active });
    res.status(201).json(record);
  } catch (err) {
    await session.abortTransaction();
    err.status = 400;
    throw err;
  } finally {
    session.endSession();
  }
});

export const traSach = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const record = await TheoDoiMuonSach.findOneAndUpdate(
      { _id: req.params.id, ngayTra: null },
      { ngayTra: new Date() },
      { new: true, session }
    );
    if (!record) throw new Error('Bản ghi không tồn tại hoặc đã trả');

    const sach = await Sach.findByIdAndUpdate(
      record.maSach, { $inc: { soQuyen: 1 } }, { new: true, session }
    );

    await session.commitTransaction();
    getIO().to('books').emit('book:updated', { id: sach._id, soQuyen: sach.soQuyen, active: sach.active });
    res.json(record);
  } catch (err) {
    await session.abortTransaction();
    err.status = 400;
    throw err;
  } finally {
    session.endSession();
  }
});