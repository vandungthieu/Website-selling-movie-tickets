import Payment from "../models/Payment";
import querystring from "qs";
import crypto from "crypto";
import config from "config";

export const createPaymentUrl = async (req, res, next) => {
  try {
    // Đặt múi giờ
    process.env.TZ = "Asia/Ho_Chi_Minh";

    //Trích xuất các tham số 
    const { amount, maLichChieu, danhSachVe, taiKhoanNguoiDung, userId } =
      req.query;
    if (
      !amount ||
      !maLichChieu ||
      !danhSachVe ||
      !taiKhoanNguoiDung ||
      !userId
    ) {
      return res.status(400).send("Missing required parameters");
    }

    // tạo phiên thanh toán
    const payment = new Payment({
      user: userId,
      amount: amount,
      maLichChieu: maLichChieu,
      danhSachVe: danhSachVe,
      taiKhoanNguoiDung: taiKhoanNguoiDung,
      orderId: generateOrderId(),
    });

    await payment.save();

    // cấu hình
    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    let returnUrl = config.get("vnp_ReturnUrl");

    // Prepare vnp_Params
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = payment.orderId;
    vnp_Params["vnp_OrderInfo"] =
      "Thanh toan cho ma GD:" + vnp_Params["vnp_TxnRef"];
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] =
      returnUrl +
      maLichChieu +
      "?" +
      querystring.stringify(
        { danhSachVe, taiKhoanNguoiDung, maLichChieu },
        { encode: false }
      );
    vnp_Params["vnp_IpAddr"] =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    vnp_Params["vnp_CreateDate"] = generateCreateDate();
    // Sort vnp_Params
    vnp_Params = sortObject(vnp_Params);

    // Create hash
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    // Tạo URL thanh toán
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    console.log(vnpUrl);
    res.send(vnpUrl);
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  const id = req.params.id;
  let payment;
  try {
    payment = await Payment.findById(id).populate("user");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database lookup failed", error: err });
  }
  if (!payment) {
    return res.status(404).json({ message: "Payment Not Found" });
  }
  return res.status(200).json({ payment });
};

export const deletePayment = async (req, res, next) => {
  const id = req.params.id;
  let payment;
  try {
    payment = await Payment.findByIdAndDelete(id).populate("user");
    if (!payment) {
      return res.status(404).json({ message: "Payment Not Found" });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    await payment.user.bookings.pull(payment);
    await payment.user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: "Deletion failed", error: err });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};

// tạo id đơn hàng
const generateOrderId = () => {
  const moment = require("moment");
  return moment().format("DDHHmmss");
};

// Tạo ngày tháng
const generateCreateDate = () => {
  const moment = require("moment");
  return moment().format("YYYYMMDDHHmmss");
};

// sắp xếp theo key
const sortObject = (obj) => {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
};


