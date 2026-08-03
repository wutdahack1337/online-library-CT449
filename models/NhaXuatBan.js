import mongoose, { Schema } from "mongoose"

const NhaXuatBanSchema = new Schema({
    maNhaXuatBan: {type: String, required: true, unique: true},
    tenNhaXuatBan: {type: String, required: true},
    diaChi: String,
    active: {type: Boolean, default: true},
})

export default mongoose.model("NhaXuatBan", NhaXuatBanSchema);