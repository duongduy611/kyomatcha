const { VietQR } = require('vietqr');
const Order = require('../models/OrderModel');
require('dotenv').config();


exports.generateVietQR = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log(orderId);
    
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(400).json({ message: "Không tìm thấy đơn hàng" });

    const vietqr = new VietQR({
      clientID: process.env.VIETQR_CLIENT_ID,
      apiKey: process.env.VIETQR_API_KEY,
    });

    const amount = order.total ?? order.totalAmount;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Giá trị đơn hàng không hợp lệ" });
    }

    const response = await vietqr.genQRCodeBase64({
      bank: process.env.VIETQR_ACQ_ID,
      accountName: process.env.VIETQR_ACCOUNT_NAME,
      accountNumber: process.env.VIETQR_ACCOUNT_NUMBER,
      amount: amount.toString(),
      memo: `Order #${order._id}`,
      template: "compact", // Hoặc compact
    });

    const { code, desc, data } = response.data;

    if (code !== "00" || !data) {
      return res.status(400).json({
        message: "Tạo mã QR thất bại",
        code,
        description: desc || "Không rõ lỗi",
      });
    }

    return res.json({
      qrBase64: data.qrDataURL,
      rawContent: data.qrCode,
      amount: amount,
      orderId: order._id,
    });
  } catch (error) {
    console.error("QR Error detail:", {
      message: error?.message,
      stack: error?.stack,
    });
    res.status(500).json({
      message: "Lỗi server khi tạo QR",
      error: error.message || "Unknown error",
    });
  }
};


