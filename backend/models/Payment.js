import mongoose from "mongoose";

const Schema = mongoose.Schema
const paymentSchema = new Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        require: true
    },
    amount: {
        type: Number,
        required: true,
    },
    maLichChieu: {
        type: String,
        required: true,
    },
    danhSachVe: {
        type: [String],
        required: true,
    },
    taiKhoanNguoiDung: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    orderId: {
        type: String,
        required: true,
    },
})

export default mongoose.model("Payment", paymentSchema);
