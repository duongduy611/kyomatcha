const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		category: { type: String, required: true },
		price: { type: Number, required: true },
		images: [{ type: String }],
		description: { type: String },
		stock: { type: Number, default: 0 },
		status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
