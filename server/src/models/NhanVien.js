import mongoose, { Schema } from "mongoose";

const NhanVienSchema = new Schema({
    maNhanVien: {type: String, required: true, unique: true},
    hoTen: {type: String, required: true},
    password: {type: String, required: true}, // hash 
    chucVu: String,
    diaChi: String, 
    soDienThoai: String, 
    active: {type: Boolean, default: true}, 
});

export default mongoose.model("NhanVien", NhanVienSchema);