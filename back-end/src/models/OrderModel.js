const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
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
				name: String,
				quantity: { type: Number, required: true },
				price: { type: Number, required: true },
			},
		],
		total: { type: Number, required: true },
		status: {
			type: String,
			enum: ['PENDING','CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
			default: 'PENDING',
		},
		shippingInfo: {
			address: { type: String, required: true },
			receiverName: { type: String },
			phone: { type: String },
		},
		paymentInfo: {
			method: { type: String },
		},
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
