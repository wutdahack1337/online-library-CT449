import mongoose, { Schema } from "mongoose"

const SachSchema = new Schema({
    tenSach: {type: String, required: true},
    donGia: {type: Number, required: true, min: 0},
    soQuyen: {type: Number, required: true, min: 0},
    namXuatBan: Number,
    tacGia: String,
    moTa: {type: String, default: ""},
    maNXB: {type: Schema.Types.ObjectId, ref: "NhaXuatBan", required: true},
    active: {type: Boolean, default: true},
});

export default mongoose.model("Sach", SachSchema)