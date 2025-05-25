const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');

// GET /cart/:userId
const getCartByUserId = async (req, res) => {
	try {
		const { userId } = req.params;
		console.log(userId);

		const cart = await Cart.findOne({ userId, isDeleted: false });
		if (!cart) return res.json({ message: 'Giỏ hàng trống', items: [] });
		res.json(cart);
	} catch (error) {
		res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error });
	}
};

// POST /cart/add
const addToCart = async (req, res) => {
	try {
		const { userId, productId, quantity, color, size } = req.body;

		const product = await Product.findById(productId);
		if (!product)
			return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

		const subPrice = product.subPrice.find(
			(item) => item.color === color && item.size === size
		);
		const price = subPrice ? subPrice.price : product.price;

		let cart = await Cart.findOne({ userId, isDeleted: false });

		if (!cart) {
			cart = new Cart({
				userId,
				items: [
					{
						productId,
						name: product.name,
						price,
						quantity,
						color,
						size,
						image: product.images[0] || '',
					},
				],
			});
		} else {
			const index = cart.items.findIndex(
				(item) =>
					item.productId.toString() === productId &&
					item.color === color &&
					item.size === size
			);

			if (index > -1) {
				cart.items[index].quantity += quantity;
			} else {
				cart.items.push({
					productId,
					name: product.name,
					price,
					quantity,
					color,
					size,
					image: product.images[0] || '',
				});
			}
		}

		const savedCart = await cart.save();
		res.status(200).json(savedCart);
	} catch (error) {
		res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng', error });
	}
};

// POST /cart/remove
const removeFromCart = async (req, res) => {
	try {
		const { userId, productId, color, size } = req.body;

		const cart = await Cart.findOne({ userId, isDeleted: false });
		if (!cart)
			return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

		cart.items = cart.items.filter(
			(item) =>
				!(
					item.productId.toString() === productId &&
					item.color === color &&
					item.size === size
				)
		);

		const savedCart = await cart.save();
		res.status(200).json(savedCart);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error });
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
const decreaseQuantityFromCart = async (req, res) => {
	try {
		const { userId, productId, color, size } = req.body;

		const cart = await Cart.findOne({ userId, isDeleted: false });
		if (!cart)
			return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

		const index = cart.items.findIndex(
			(item) =>
				item.productId.toString() === productId &&
				item.color === color &&
				item.size === size
		);

		if (index === -1)
			return res
				.status(404)
				.json({ message: 'Sản phẩm không có trong giỏ hàng' });

		if (cart.items[index].quantity > 1) {
			cart.items[index].quantity -= 1;
		} else {
			cart.items.splice(index, 1);
		}

		const savedCart = await cart.save();
		res.status(200).json(savedCart);
	} catch (error) {
		res.status(500).json({ message: 'Lỗi khi giảm số lượng sản phẩm', error });
	}
};

//tăng số lượng sản phẩm trong giỏ hàng /increase
const increaseQuantityFromCart = async (req, res) => {
	try {
		const { userId, productId, color, size } = req.body;

		const cart = await Cart.findOne({ userId, isDeleted: false });
		if (!cart)
			return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

		const index = cart.items.findIndex(
			(item) =>
				item.productId.toString() === productId &&
				item.color === color &&
				item.size === size
		);

		if (index === -1)
			return res
				.status(404)
				.json({ message: 'Sản phẩm không có trong giỏ hàng' });

		cart.items[index].quantity += 1;

		const savedCart = await cart.save();
		res.status(200).json(savedCart);
	} catch (error) {
		res.status(500).json({ message: 'Lỗi khi tăng số lượng sản phẩm', error });
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
