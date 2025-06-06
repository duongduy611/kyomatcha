const express = require('express');
const {
	getOrdersByCustomer,
	createOrder,
	getOrderById,
	getAllOrders,
	updateOrderStatus,
	confirmPayment,
} = require('../controllers/OrderController');

const router = express.Router();

// Lấy tất cả đơn hàng của 1 customer
router.get('/customer/:customerId', getOrdersByCustomer);

// Tạo đơn hàng mới
router.post('/', createOrder);

// Lấy đơn hàng theo ID
router.get('/:orderId', getOrderById);

// Quản trị viên/nhân viên: lấy toàn bộ đơn hàng
router.get('/', getAllOrders);

// Cập nhật trạng thái đơn hàng (nếu có)
router.put('/:orderId/status', updateOrderStatus);

// Route: xác nhận đã thanh toán và gửi mail
router.post('/confirm-payment', confirmPayment);

module.exports = router;
