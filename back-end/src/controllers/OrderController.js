const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const Combo = require('../models/ComboModel');
const { sendMailOrderConfirmation } = require('../utils/sendMail');

const User = require('../models/UserModel');
// GET /orders/customer/:customerId
const getOrdersByCustomer = async (req, res) => {
	try {
		const { customerId } = req.params;
		// 1️⃣ Lấy orders, lean() để có object JS
		const orders = await Order.find({
			userId: customerId,
			isDeleted: false,
		}).lean();

		// 2️⃣ Enrich từng order.items
		const enriched = await Promise.all(
			orders.map(async (order) => {
				order.items = await Promise.all(
					order.items.map(async (item) => {
						// ——— A. Thử lookup Product ———
						if (item.productId) {
							const prod = await Product.findById(item.productId)
								.select('name images')
								.lean();
							if (prod) {
								return {
									...item,
									kind: 'Product',
									name: prod.name,
									images: prod.images,
								};
							}
						}

						// ——— B. Nếu không phải Product, thử lookup Combo ———
						if (item.productId) {
							const combo = await Combo.findById(item.productId)
								.select('title matcha images')
								.lean();
							if (combo) {
								// tìm variant (matcha) đã chọn dựa vào item.title
								const variant = Array.isArray(combo.matcha)
									? combo.matcha.find((m) => m.title === item.title)
									: null;

								return {
									...item,
									kind: 'Combo',
									comboTitle: combo.title,
									comboImages: combo.images,
									variant: variant
										? {
												// chỉ gán nếu tìm thấy
												title: variant.title,
												image: variant.image,
												price: variant.price,
										  }
										: null,
								};
							}
						}

						// ——— C. Fallback: nếu không tìm được cả hai ———
						return { ...item, kind: 'Unknown' };
					})
				);
				return order;
			})
		);

		return res.json(enriched);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Lỗi khi lấy đơn hàng của khách hàng',
			error: err.message,
		});
	}
};

// POST /orders
const createOrder = async (req, res) => {
	try {
		const { userId, items, total, shippingInfo, paymentInfo } = req.body;

		// 1️⃣ Validate
		if (
			!userId ||
			!Array.isArray(items) ||
			items.length === 0 ||
			!total ||
			!shippingInfo
		) {
			return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
		}

		// 2️⃣ Normalize items để lưu cả combo & product đúng cách
		const orderItems = items.map((item) => {
			if (item.comboId) {
				// Đây là combo (base hoặc variant)
				return {
					productId: item.comboId, // lưu vào chung field productId
					title: item.matchaTitle || item.comboTitle, // matchaTitle hoặc fallback title
					price: item.price,
					quantity: item.quantity,
				};
			} else {
				// Đây là product thường
				return {
					productId: item.productId,
					name: item.name,
					color: item.color,
					size: item.size,
					price: item.price,
					quantity: item.quantity,
				};
			}
		});

		// 3️⃣ Tạo order mới với orderItems đã normalize
		const newOrder = new Order({
			userId,
			items: orderItems,
			total,
			shippingInfo,
			paymentInfo,
		});

		const savedOrder = await newOrder.save();

		// 4️⃣ Tính và cộng điểm cho user (ghi theo logic cũ) :contentReference[oaicite:0]{index=0}
		const pointsToAdd = Math.floor(total / 100000) * 10;
		if (pointsToAdd > 0) {
			await User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd } });
		}

		return res.status(201).json(savedOrder);
	} catch (error) {
		console.error('Lỗi tạo đơn hàng:', error);
		return res
			.status(500)
			.json({ message: 'Lỗi khi tạo đơn hàng', error: error.message });
	}
};

// GET /orders/:orderId
const getOrderById = async (req, res) => {
	try {
		const { orderId } = req.params;

		// 1️⃣ Lấy raw order (plain JS object)
		const order = await Order.findById(orderId).lean();
		if (!order || order.isDeleted) {
			return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
		}

		// 2️⃣ Enrich từng item trong order.items
		order.items = await Promise.all(
			order.items.map(async (item) => {
				// ——— PRODUCT ———
				// nếu item có field `name` thì đây là sản phẩm bình thường
				if (item.name) {
					const prod = await Product.findById(item.productId)
						.select('name images')
						.lean();
					return {
						...item,
						kind: 'Product',
						product: prod,
					};
				}

				// ——— COMBO ———
				// ngược lại là combo
				const combo = await Combo.findById(item.productId)
					.select('title matcha images')
					.lean();
				// tìm đúng variant dựa trên item.title
				const variant = Array.isArray(combo.matcha)
					? combo.matcha.find((m) => m.title === item.title) || null
					: null;

				return {
					...item,
					kind: 'Combo',
					comboTitle: combo.title,
					comboImages: combo.images,
					variant, // { title, image, price } hoặc null nếu base combo
				};
			})
		);

		// 3️⃣ Trả về order đã enrich
		return res.status(200).json(order);
	} catch (err) {
		console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
		return res.status(500).json({
			message: 'Lỗi khi lấy chi tiết đơn hàng',
			error: err.message,
		});
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
  try {
    const { orderId } = req.body;

    // 1️⃣ Load order + user email
    let order = await Order.findById(orderId)
                           .populate('userId', 'email')
                           .lean();
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // 2️⃣ Update status
    await Order.findByIdAndUpdate(orderId, { status: 'PENDING' });
    order.status = 'PENDING';

    // 3️⃣ Enrich items for email template
    order.items = await Promise.all(
      order.items.map(async item => {
        // — Product?
        if (item.name) {
          const prod = await Product.findById(item.productId)
                                    .select('name images')
                                    .lean();
          return {
            ...item,
            kind:    'Product',
            product: prod
          };
        }
        // — Combo
        const combo = await Combo.findById(item.productId)
                                 .select('title matcha images')
                                 .lean();
        const variant = Array.isArray(combo.matcha)
          ? combo.matcha.find(m => m.title === item.title) || null
          : null;
        return {
          ...item,
          kind:        'Combo',
          comboTitle:  combo.title,
          comboImages: combo.images,
          variant      // could be null if base‐combo
        };
      })
    );

    // 4️⃣ Send the confirmation email
    await sendMailOrderConfirmation(order.userId.email, order);

    // 5️⃣ Return success + enriched order if you like
    return res.json({
      success: true,
      message: 'Đã xác nhận thanh toán và gửi mail',
      order
    });

  } catch (err) {
    console.error('confirmPayment error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xác nhận thanh toán',
      error: err.message
    });
  }
};

module.exports = {
	getOrdersByCustomer,
	createOrder,
	getOrderById,
	getAllOrders,
	updateOrderStatus,
	confirmPayment,
};
