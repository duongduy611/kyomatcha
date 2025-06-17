const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		category: { type: String, required: true },
		subCategory: [{
			color: { type: String, required: false },
			size: { type: String, required: false },
			images: { type: String, required: false }
		}],
		price: { type: Number, required: true },
		subPrice: [{
			color: { type: String, required: false },
			size: { type: String, required: false },
			price: { type: Number, required: false }
		}],
		images: [{ type: String }],
		description: { type: String },
		stock: { type: Number, default: 0 },
		status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
		isDeleted: { type: Boolean, default: false },
		shortDescription: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
