import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import NhanVien from '../models/NhanVien.js';

await mongoose.connect(process.env.MONGO_URI);
const hashed = await bcrypt.hash('123456', 10);
await NhanVien.create({
  maNhanVien: 'NV001',
  hoTen: 'Admin Test',
  password: hashed,
  chucVu: 'Thủ thư'
});
console.log('Seed xong');
process.exit(0);