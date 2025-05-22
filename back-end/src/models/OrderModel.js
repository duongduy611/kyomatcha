const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity:  { type: Number, required: true },
      price:     { type: Number, required: true } // snapshot tại thời điểm mua
    }
  ],
  totalAmount:     { type: Number, required: true },
  status:          { type: String, enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
  shippingAddress: { type: String, required: true },
  isDeleted:       { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
