import mongoose from "mongoose";
import { Schema } from "mongoose";

const DocGiaSchema = new Schema({
    maDocGia: {type: String, required: true, unique: true},
    hoTen: {type: String, required: true},
    ngaySinh: Date,
    phai: String,
    diaChi: String,
    dienThoai: {type: String, required: true, unique: true}, // khoa dedupe 
    active: {type: Boolean, default: true},
});

export default mongoose.model("DocGia", DocGiaSchema);