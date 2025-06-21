const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const Combo = require('../models/ComboModel');

// helper nếu bạn dùng enrichCart như trước
// helper để populate thêm comboTitle/variant hoặc product.name
async function enrichCart(cartDoc) {
	const cart = cartDoc.toObject();
	cart.items = await Promise.all(
		cart.items.map(async (item) => {
			// ——— PRODUCT ———
			if (item.name) {
				const p = await Product.findById(item.productId).select('name').lean();
				return { ...item, name: p?.name };
			}
			// ——— COMBO ———
			const combo = await Combo.findById(item.productId)
				.select('title matcha')
				.lean();
			// tìm variant (matchaTitle)
			const variant = combo.matcha.find((m) => m.title === item.title) || null;
			return {
				...item,
				comboTitle: combo.title, // tên combo gốc
				variant, // full object {title,image,price} hoặc null nếu base combo
			};
		})
	);
	return cart;
}

// GET /cart/:userId
// controllers/cart.controller.js
const getCartByUserId = async (req, res) => {
	try {
		const { userId } = req.params;
		const cartDoc = await Cart.findOne({ userId, isDeleted: false });
		if (!cartDoc) return res.json({ message: 'Giỏ hàng trống', items: [] });

		const cart = cartDoc.toObject();
		cart.items = await Promise.all(
			cart.items.map(async (item) => {
				// ——— Sản phẩm thường ———
				if (item.name) {
					const prod = await Product.findById(item.productId)
						.select('name')
						.lean();
					return { ...item, name: prod?.name };
				}

				// ——— Combo ———
				// Lấy combo gốc và mảng variants
				const combo = await Combo.findById(item.productId)
					.select('title matcha')
					.lean();
				// tìm đúng variant đã chọn (dựa trên item.title chứa matchaTitle)
				const variant =
					combo.matcha.find((m) => m.title === item.title) || null;

				return {
					...item,
					comboTitle: combo.title, // tên combo gốc
					variant, // { title, image, price }
				};
			})
		);

		return res.json(cart);
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ message: 'Lỗi khi lấy giỏ hàng', error: err.message });
	}
};

// POST /cart/add
const addToCart = async (req, res) => {
	try {
		// 1️⃣ Lấy payload
		const {
			userId,
			productId, // với product thường
			comboId, // với combo
			matchaTitle, // tên variant nếu chọn
			quantity,
			color, // chỉ product
			size, // chỉ product
		} = req.body;

		// 2️⃣ Validate tối thiểu
		if (!userId || !quantity || (!comboId && !productId)) {
			return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
		}

		// 3️⃣ Xác định loại item và id gốc
		const isCombo = Boolean(comboId);
		const id = comboId || productId;

		// 4️⃣ Load source từ DB
		let source = isCombo
			? await Combo.findById(id)
			: await Product.findById(id);

		if (!source) {
			return res.status(404).json({
				message: isCombo ? 'Combo không tồn tại' : 'Sản phẩm không tồn tại',
			});
		}

		// 5️⃣ Tính giá, title/name, image
		let price, title, name, image;
		if (isCombo) {
			if (matchaTitle) {
				// lookup variant theo title
				const variant = source.matcha.find((m) => m.title === matchaTitle);
				if (!variant) {
					return res
						.status(404)
						.json({ message: 'Matcha variant không tồn tại' });
				}
				price = variant.price;
				title = variant.title;
				image = variant.image || source.images[0];
			} else {
				// base combo
				price = source.price;
				title = source.title;
				image = source.images[0];
			}
		} else {
			// product bình thường
			const sub = source.subPrice.find(
				(p) => p.color === color && p.size === size
			);
			price = sub ? sub.price : source.price;
			name = source.name;
			image = source.images?.[0];
		}

		// 6️⃣ Lấy hoặc tạo cart
		let cart = await Cart.findOne({ userId, isDeleted: false });
		if (!cart) cart = new Cart({ userId, items: [] });

		// 7️⃣ Tìm xem item đã có chưa
		const idx = cart.items.findIndex((item) => {
			if (item.productId.toString() !== id) return false;
			if (isCombo) {
				// match trên title cho combo/variant
				return item.title === title;
			}
			// match trên color+size cho product
			return item.color === color && item.size === size;
		});

		// 8️⃣ Cập nhật hoặc push mới
		if (idx > -1) {
			cart.items[idx].quantity += quantity;
		} else {
			const newItem = { productId: id, price, quantity, image };
			if (isCombo) {
				newItem.title = title;
			} else {
				newItem.name = name;
				newItem.color = color;
				newItem.size = size;
			}
			cart.items.push(newItem);
		}

		// 9️⃣ Lưu và trả về
		const saved = await cart.save();
		return res.status(200).json(saved);
	} catch (err) {
		console.error('Error in addToCart:', err);
		return res.status(500).json({
			message: 'Lỗi khi thêm vào giỏ hàng',
			error: err.message,
		});
	}
};
// POST /cart/remove
const removeFromCart = async (req, res) => {
	try {
		const {
			userId,
			productId, // với product thường
			comboId, // với combo
			matchaTitle, // tên variant đã chọn, hoặc combo.title nếu remove base combo
			color, // với product
			size, // với product
		} = req.body;

		// Validate tối thiểu
		if (!userId || (!productId && !comboId)) {
			return res
				.status(400)
				.json({ message: 'Thiếu userId hoặc productId/comboId' });
		}

		const isCombo = Boolean(comboId);
		const id = comboId || productId;

		// Lấy cart
		const cart = await Cart.findOne({ userId, isDeleted: false });
		if (!cart) {
			return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
		}

		// Lọc items: chỉ giữ những item KHÔNG phải target
		cart.items = cart.items.filter((item) => {
			if (item.productId.toString() !== id) {
				// không phải cùng product/combo → giữ lại
				return true;
			}
			if (isCombo) {
				// combo: so sánh title để biết base combo hay variant
				return item.title !== matchaTitle;
			}
			// product: so sánh color + size
			return !(item.color === color && item.size === size);
		});

		// Lưu và trả về (có thể enrich nếu cần)
		const saved = await cart.save();
		const enriched = await enrichCart(saved);
		return res.status(200).json(enriched);
	} catch (err) {
		console.error('Error in removeFromCart:', err);
		return res.status(500).json({
			message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng',
			error: err.message,
		});
	}
};

// DELETE /cart/:userId
const clearCart = async (req, res) => {
	try {
		const { userId } = req.params;

		const cart = await Cart.findOne({ userId });
		if (!cart)
			return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

		cart.items = [];
		await cart.save();

		res.status(200).json({ message: 'Đã xóa toàn bộ giỏ hàng' });
	} catch (error) {
		res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng', error });
	}
};

//giảm số lượng sản phẩm trong giỏ hàng /decrease
// Giảm số lượng, nếu =1 thì remove khỏi cart
const decreaseQuantityFromCart = async (req, res) => {
	try {
		const { userId, productId, comboId, matchaTitle, color, size } = req.body;

		if (!userId || (!productId && !comboId)) {
			return res
				.status(400)
				.json({ message: 'Thiếu userId hoặc productId/comboId' });
		}

		const isCombo = Boolean(comboId);
		const id = comboId || productId;

		const cart = await Cart.findOne({ userId, isDeleted: false });
		if (!cart) {
			return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
		}

		// tìm item đúng
		const idx = cart.items.findIndex((item) => {
			if (item.productId.toString() !== id) return false;
			if (isCombo) {
				// với combo, so sánh title (có thể là base combo hoặc variant matcha)
				return item.title === matchaTitle;
			}
			// với product, so sánh color + size
			return item.color === color && item.size === size;
		});

		if (idx === -1) {
			return res
				.status(404)
				.json({ message: 'Sản phẩm không có trong giỏ hàng' });
		}

		// giảm hoặc xóa
		if (cart.items[idx].quantity > 1) {
			cart.items[idx].quantity -= 1;
		} else {
			cart.items.splice(idx, 1);
		}

		const saved = await cart.save();
		const enriched = await enrichCart(saved);
		return res.status(200).json(enriched);
	} catch (err) {
		console.error('Error in decreaseQuantityFromCart:', err);
		return res
			.status(500)
			.json({ message: 'Lỗi giảm số lượng', error: err.message });
	}
};

const increaseQuantityFromCart = async (req, res) => {
	try {
		const { userId, productId, comboId, matchaTitle, color, size } = req.body;
		console.log(comboId);

		if (!userId || (!productId && !comboId)) {
			return res
				.status(400)
				.json({ message: 'Thiếu userId hoặc productId/comboId' });
		}

		const isCombo = Boolean(comboId);
		const id = comboId || productId;

		const cart = await Cart.findOne({ userId, isDeleted: false });
		if (!cart) {
			return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
		}

		// tìm item đúng
		const idx = cart.items.findIndex((item) => {
			if (item.productId.toString() !== id) return false;
			if (isCombo) {
				return item.title === matchaTitle;
			}
			return item.color === color && item.size === size;
		});

		if (idx === -1) {
			return res
				.status(404)
				.json({ message: 'Sản phẩm không có trong giỏ hàng' });
		}

		cart.items[idx].quantity += 1;

		const saved = await cart.save();
		const enriched = await enrichCart(saved);
		return res.status(200).json(enriched);
	} catch (err) {
		console.error('Error in increaseQuantityFromCart:', err);
		return res
			.status(500)
			.json({ message: 'Lỗi tăng số lượng', error: err.message });
	}
};

module.exports = {
	getCartByUserId,
	addToCart,
	removeFromCart,
	clearCart,
	decreaseQuantityFromCart,
	increaseQuantityFromCart,
};
