import mongoose, { Schema } from "mongoose"

const NhaXuatBanSchema = new Schema({
    tenNhaXuatBan: {type: String, required: true},
    diaChi: String,
    active: {type: Boolean, default: true},
})

export default mongoose.model("NhaXuatBan", NhaXuatBanSchema);