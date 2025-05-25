const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				name: { type: String }, // bổ sung thêm để lưu tên sản phẩm khi thêm vào cart
				price: { type: Number }, // lưu giá tại thời điểm thêm vào giỏ (snapshot)
				quantity: { type: Number, required: true, min: 1 },
				color: { type: String, required: false }, 
				size: { type: String, required: false }, 
				image: { type: String, required: false }, 
			},
		],
		isDeleted: { type: Boolean, default: false }, // đổi tên cho thống nhất với data
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
