import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import DocGia from '../models/DocGia.js';
import NhanVien from '../models/NhanVien.js';
import NhaXuatBan from '../models/NhaXuatBan.js';
import Sach from '../models/Sach.js';
import TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Kết nối DB thành công, bắt đầu seed...');

  // Xóa sạch dữ liệu cũ để seed lại từ đầu (chỉ dùng lúc dev)
  await Promise.all([
    DocGia.deleteMany({}),
    NhanVien.deleteMany({}),
    NhaXuatBan.deleteMany({}),
    Sach.deleteMany({}),
    TheoDoiMuonSach.deleteMany({})
  ]);

  // 1. NhanVien — password hash, KHÔNG lưu plaintext
  const hashedPassword = await bcrypt.hash('123456', 10);
  const nhanViens = await NhanVien.insertMany([
    { maNhanVien: 'NV001', hoTen: 'Nguyễn Văn Admin', password: hashedPassword, chucVu: 'Thủ thư trưởng', diaChi: 'Q1, TP.HCM', soDienThoai: '0901111111' },
    { maNhanVien: 'NV002', hoTen: 'Trần Thị Thư', password: hashedPassword, chucVu: 'Thủ thư', diaChi: 'Q3, TP.HCM', soDienThoai: '0902222222' }
  ]);

  // 2. NhaXuatBan
  const nxbs = await NhaXuatBan.insertMany([
    { tenNhaXuatBan: 'NXB Trẻ', diaChi: '161B Lý Chính Thắng, Q3, TP.HCM' },
    { tenNhaXuatBan: 'NXB Kim Đồng', diaChi: '55 Quang Trung, Hà Nội' },
    { tenNhaXuatBan: 'NXB Giáo Dục', diaChi: '81 Trần Hưng Đạo, Hà Nội' }
  ]);

  // 3. Sach — tham chiếu _id thật của NXB vừa tạo, không hardcode
  const sachs = await Sach.insertMany([
    { tenSach: 'Dế Mèn Phiêu Lưu Ký', donGia: 45000, soQuyen: 5, namXuatBan: 2020, tacGia: 'Tô Hoài', maNXB: nxbs[1]._id, moTa: 'Hành trình phiêu lưu của chú dế Mèn qua thế giới loài vật, gửi gắm bài học về tính khiêm tốn và lòng dũng cảm. Tác phẩm thiếu nhi kinh điển của văn học Việt Nam.' },
    { tenSach: 'Số Đỏ', donGia: 60000, soQuyen: 3, namXuatBan: 2019, tacGia: 'Vũ Trọng Phụng', maNXB: nxbs[0]._id, moTa: 'Tiểu thuyết trào phúng kể về Xuân Tóc Đỏ, từ kẻ hạ lưu bước lên đỉnh cao xã hội nhờ may mắn và sự lố lăng của xã hội thượng lưu thời Pháp thuộc.' },
    { tenSach: 'Toán Cao Cấp A1', donGia: 85000, soQuyen: 1, namXuatBan: 2021, tacGia: 'Nguyễn Đình Trí', maNXB: nxbs[2]._id, moTa: 'Giáo trình toán cao cấp dành cho sinh viên năm nhất khối ngành kỹ thuật, gồm giới hạn, đạo hàm, tích phân và chuỗi số.' },
    { tenSach: 'Lập Trình Web Với Node.js', donGia: 120000, soQuyen: 0, namXuatBan: 2022, tacGia: 'Trần Văn A', maNXB: nxbs[0]._id, moTa: 'Hướng dẫn xây dựng ứng dụng web full-stack với Node.js, Express và MongoDB, từ cơ bản đến triển khai thực tế.' }, // hết sách, test case "hết"
    { tenSach: 'Sách Giáo Khoa Toán 12', donGia: 30000, soQuyen: 10, namXuatBan: 2023, tacGia: 'Bộ GD&ĐT', maNXB: nxbs[2]._id, moTa: 'Sách giáo khoa Toán lớp 12 chương trình chuẩn của Bộ Giáo dục và Đào tạo, bao gồm giải tích và hình học không gian.' }
  ]);

  // 4. DocGia
  const docgias = await DocGia.insertMany([
    { maDocGia: 'DG001', hoTen: 'Lê Văn Minh', ngaySinh: new Date('2000-05-10'), phai: 'Nam', diaChi: 'Q5, TP.HCM', dienThoai: '0911111111' },
    { maDocGia: 'DG002', hoTen: 'Phạm Thị Hoa', ngaySinh: new Date('2001-08-20'), phai: 'Nữ', diaChi: 'Q10, TP.HCM', dienThoai: '0922222222' }
  ]);

  // 5. TheoDoiMuonSach — 1 bản ghi đang mượn (ngayTra: null), 1 bản ghi đã trả — test cả 2 case UI
  await TheoDoiMuonSach.insertMany([
    { maDocGia: docgias[0]._id, maSach: sachs[0]._id, ngayMuon: new Date('2026-07-20'), ngayTra: null },
    { maDocGia: docgias[1]._id, maSach: sachs[1]._id, ngayMuon: new Date('2026-07-01'), ngayTra: new Date('2026-07-15') }
  ]);

  console.log('Seed xong:');
  console.log(`- ${nhanViens.length} NhanVien (đăng nhập: maNhanVien=NV001, password=123456)`);
  console.log(`- ${nxbs.length} NhaXuatBan`);
  console.log(`- ${sachs.length} Sach (S003 còn 1 quyển, S004 hết sách — dùng test race condition & hết sách)`);
  console.log(`- ${docgias.length} DocGia`);
  console.log('- 2 TheoDoiMuonSach (1 đang mượn, 1 đã trả)');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed lỗi:', err);
  process.exit(1);
});