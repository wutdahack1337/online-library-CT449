import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import NhanVien from '../models/NhanVien.js';

export async function login(req, res) {
  const { maNhanVien, password } = req.body;
  if (!maNhanVien || !password) {
    return res.status(400).json({ message: 'Thiếu mã nhân viên hoặc mật khẩu' });
  }

  const nv = await NhanVien.findOne({ maNhanVien, active: true });
  if (!nv) return res.status(401).json({ message: 'Sai mã nhân viên hoặc mật khẩu' });

  const match = await bcrypt.compare(password, nv.password);
  if (!match) return res.status(401).json({ message: 'Sai mã nhân viên hoặc mật khẩu' });

  const token = jwt.sign({ id: nv._id, maNhanVien: nv.maNhanVien }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, hoTen: nv.hoTen, chucVu: nv.chucVu });
}