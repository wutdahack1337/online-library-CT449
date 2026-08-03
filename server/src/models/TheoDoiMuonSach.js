import mongoose, { Schema } from "mongoose";

const TheoDoiMuonSachSchema = new Schema({
    maDocGia: {type: Schema.Types.ObjectId, ref: "DocGia", required: true},
    maSach: {type: Schema.Types.ObjectId, ref: "Sach", required: true},
    ngayMuon: {type: Date, required: true, default: Date.now},
    ngayTra: {type: Date, default: null},
})

export default mongoose.model("TheoDoiMuonSach", TheoDoiMuonSachSchema);