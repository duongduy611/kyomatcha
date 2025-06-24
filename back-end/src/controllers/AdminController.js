const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const Combo = require('../models/ComboModel');
const User = require('../models/UserModel');

// @desc    Get all orders (admin) with enriched item details
// @route   GET /admin/orders
// @access  Admin
exports.getOrders = async (req, res) => {
	try {
		// 1️⃣ Lấy về orders (chưa xóa) kèm thông tin user
		let orders = await Order.find({ isDeleted: false })
			.populate('userId', 'name email')
			.sort({ createdAt: -1 })
			.lean();

		// 2️⃣ Enrich từng item: lookup Product hoặc Combo
		const enriched = await Promise.all(
			orders.map(async (order) => {
				order.items = await Promise.all(
					order.items.map(async (item) => {
						// — Product đơn lẻ —
						if (item.name) {
							const prod = await Product.findById(item.productId)
								.select('name images')
								.lean();
							return {
								...item,
								kind: 'Product',
								name: prod?.name || item.name,
								images: prod?.images || [],
							};
						}

						// — Combo —
						if (item.productId) {
							const combo = await Combo.findById(item.productId)
								.select('title matcha images')
								.lean();
							if (combo) {
								const variant = Array.isArray(combo.matcha)
									? combo.matcha.find((m) => m.title === item.title) || null
									: null;
								return {
									...item,
									kind: 'Combo',
									comboTitle: combo.title,
									comboImages: combo.images,
									variant: variant
										? {
												title: variant.title,
												image: variant.image,
												price: variant.price,
										  }
										: null,
								};
							}
						}

						// — Fallback —
						return { ...item, kind: 'Unknown' };
					})
				);
				return order;
			})
		);

		return res.status(200).json({
			message: 'Orders retrieved successfully',
			orders: enriched,
		});
	} catch (error) {
		console.error('Error fetching orders:', error);
		return res.status(500).json({
			message: 'Server error while fetching orders',
			error: error.message,
		});
	}
};

// @desc    Get a single order by ID (admin)
// @route   GET /admin/order/:id
// @access  Admin
exports.getOrderById = async (req, res) => {
	try {
		const { id } = req.params;

		// 1️⃣ Lấy order, lean() để có object thuần
		let order = await Order.findOne({ _id: id, isDeleted: false })
			.populate('userId', 'fullName email')
			.lean();
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		// 2️⃣ Enrich từng item tương tự getOrders
		order.items = await Promise.all(
			order.items.map(async (item) => {
				// — Product đơn lẻ —
				if (item.productId && !item.title) {
					const prod = await Product.findById(item.productId)
						.select('name images')
						.lean();
					return {
						...item,
						kind: 'Product',
						name: prod?.name || item.name,
						images: prod?.images || [],
					};
				}
				// — Combo —
				if (item.productId && item.title) {
					const combo = await Combo.findById(item.productId)
						.select('title matcha images')
						.lean();
					// tìm variant matcha để lấy ảnh
					const variant = Array.isArray(combo.matcha)
						? combo.matcha.find((m) => m.title === item.title)
						: null;
					return {
						...item,
						kind: 'Combo',
						comboTitle: combo.title,
						images: variant?.image ? [variant.image] : combo.images || [],
					};
				}
				// — Fallback —
				return { ...item, images: [] };
			})
		);

		return res.status(200).json({
			message: 'Order retrieved successfully',
			order,
		});
	} catch (error) {
		console.error('Error fetching order:', error);
		return res.status(500).json({
			message: 'Server error while fetching order',
			error: error.message,
		});
	}
};

// @desc    Update order status (admin)
// @route   PATCH /admin/order/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const validStatuses = [
			'PENDING',
			'CONFIRMED',
			'SHIPPED',
			'DELIVERED',
			'CANCELLED',
		];
		if (!status || !validStatuses.includes(status)) {
			return res.status(400).json({ message: 'Invalid or missing status' });
		}

		// 1️⃣ Cập nhật status, lấy về doc MỚI
		const updatedOrder = await Order.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ status },
			{ new: true }
		).lean();
		if (!updatedOrder) {
			return res.status(404).json({ message: 'Order not found' });
		}

		// 2️⃣ Enrich ảnh cho từng item giống getOrders
		const enrichedItems = await Promise.all(
			updatedOrder.items.map(async (item) => {
				// Nếu là product đơn lẻ
				if (item.productId && !item.title) {
					const prod = await Product.findById(item.productId)
						.select('images')
						.lean();
					return {
						...item,
						images: prod?.images || [],
					};
				}
				// Nếu là combo
				if (item.productId && item.title) {
					const combo = await Combo.findById(item.productId)
						.select('images matcha')
						.lean();
					// tìm variant matcha tương ứng để lấy ảnh nếu có
					const variant = Array.isArray(combo.matcha)
						? combo.matcha.find((m) => m.title === item.title)
						: null;
					return {
						...item,
						images: variant?.image ? [variant.image] : combo?.images || [],
					};
				}
				// fallback
				return { ...item, images: [] };
			})
		);

		updatedOrder.items = enrichedItems;

		return res.status(200).json({
			message: 'Order status updated successfully',
			order: updatedOrder,
		});
	} catch (error) {
		console.error('Error updating order status:', error);
		return res.status(500).json({
			message: 'Server error while updating status',
			error: error.message,
		});
	}
};

// @desc    Soft delete an order (admin)
// @route   DELETE /admin/order/:id
// @access  Admin
exports.deleteOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const order = await Order.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
			{ new: true }
		);

		if (!order) {
			return res
				.status(404)
				.json({ message: 'Order not found or already deleted' });
		}

		return res.status(200).json({ message: 'Order deleted successfully' });
	} catch (error) {
		console.error('Error deleting order:', error);
		return res.status(500).json({
			message: 'Server error while deleting order',
			error: error.message,
		});
	}
};
