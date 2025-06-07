const Order = require('../models/OrderModel');
const { sendMailOrderConfirmation } = require('../utils/sendMail');

const User = require('../models/UserModel');
// GET /orders/customer/:customerId
const getOrdersByCustomer = async (req, res) => {
	try {
		const { customerId } = req.params;

		const orders = await Order.find({
			userId: customerId,
			isDeleted: false,
		}).populate('items.productId', 'name images');

		res.json(orders);
	} catch (error) {
		console.error('Lỗi khi lấy đơn hàng:', error);
		res.status(500).json({
			message: 'Lỗi khi lấy đơn hàng của khách hàng',
			error: error.message || error,
		});
	}
};

// POST /orders
const createOrder = async (req, res) => {
	try {
		const { userId, items, total, shippingInfo, paymentInfo } = req.body;

		if (!userId || !items || items.length === 0 || !total || !shippingInfo) {
			return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
		}

		const newOrder = new Order({
			userId,
			items,
			total,
			shippingInfo,
			paymentInfo,
		});

		const savedOrder = await newOrder.save();
		// Cộng điểm cho user
		const pointsToAdd = Math.floor(total / 100000) * 10;
		if (pointsToAdd > 0) {
			await User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd } });
		}
		res.status(201).json(savedOrder);
	} catch (error) {
		console.error('Lỗi tạo đơn hàng:', error);
		res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error });
	}
};

// GET /orders/:orderId
const getOrderById = async (req, res) => {
	try {
		const { orderId } = req.params;

		// Tìm đơn hàng và populate sản phẩm trong từng item
		const order = await Order.findById(orderId).populate('items.productId');

		// Kiểm tra tồn tại và trạng thái đã xoá
		if (!order || order.isDeleted) {
			return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
		}

		res.status(200).json(order);
	} catch (error) {
		console.error('Lỗi khi lấy đơn hàng:', error);
		res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error });
	}
};

// GET /orders
const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find({ isDeleted: false }).populate(
			'userId items.productId'
		);
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: 'Lỗi khi lấy tất cả đơn hàng', error });
	}
};

// PUT /orders/:orderId/status
const updateOrderStatus = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { status } = req.body;

		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{ status },
			{ new: true }
		);

		if (!updatedOrder || updatedOrder.isDeleted) {
			return res
				.status(404)
				.json({ message: 'Không tìm thấy đơn hàng để cập nhật' });
		}

		res.json(updatedOrder);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng', error });
	}
};

const confirmPayment = async (req, res) => {
	const { orderId } = req.body;
	const order = await Order.findById(orderId).populate('userId'); // lấy email từ user

	if (!order)
		return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

	order.status = 'PENDING';
	await order.save();
	console.log(order.userId.email);
	
	// Gửi email xác nhận
	try {
		await sendMailOrderConfirmation(order.userId.email, order);
	} catch (err) {
		console.error('Gửi mail thất bại:', err);
	}

	res.json({ success: true, message: 'Đã xác nhận thanh toán và gửi mail' });
};

module.exports = {
	getOrdersByCustomer,
	createOrder,
	getOrderById,
	getAllOrders,
	updateOrderStatus,
	confirmPayment,
};
