const User = require('../models/UserModel');
const Order = require('../models/OrderModel');

// Lấy điểm hiện tại của user
const getUserPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy điểm', error });
  }
};

// Lấy lịch sử tích điểm từ các đơn hàng
const getUserPointHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    const history = orders.map(order => ({
      orderId: order._id,
      total: order.total,
      points: Math.floor(order.total / 100000) * 10,
      createdAt: order.createdAt
    }));
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử điểm', error });
  }
};

// Quy đổi điểm lấy voucher
const exchangePoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const { points } = req.body;
    let voucher = null;
    if (points === 50) voucher = '15%';
    else if (points === 100) voucher = '30%';
    else return res.status(400).json({ message: 'Chỉ có thể đổi 50 hoặc 100 điểm' });
    const user = await User.findById(userId);
    if (!user || user.points < points) return res.status(400).json({ message: 'Không đủ điểm' });
    user.points -= points;
    await user.save();
    res.json({ message: `Đổi thành công voucher ${voucher}`, voucher });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi quy đổi điểm', error });
  }
};

module.exports = { getUserPoints, getUserPointHistory, exchangePoints };
