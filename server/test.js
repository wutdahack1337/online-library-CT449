import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

import Sach from "./src/models/Sach.js";
import TheoDoiMuonSach from "./src/models/TheoDoiMuonSach.js";
import NhaXuatBan from "./src/models/NhaXuatBan.js";
import DocGia from "./src/models/DocGia.js";
import NhanVien from "./src/models/NhanVien.js";

dotenv.config();

connectDB().then(async () => {
    const Sachlist = await Sach.find();
    console.log(Sachlist);

    const DocGialist = await DocGia.find();
    console.log(DocGialist);

    const NhaXuatBanlist = await NhaXuatBan.find();
    console.log(NhaXuatBanlist);

    const NhanVienlist = await NhanVien.find();
    console.log(NhanVienlist);

    const TheoDoiMuonSachlist = await TheoDoiMuonSach.find();
    console.log(TheoDoiMuonSachlist);
    process.exit(0);
});
