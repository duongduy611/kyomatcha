const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    },
    { 
        timestamps: true,
        // Tạo unique compound index để đảm bảo mỗi user chỉ có thể favorite một sản phẩm một lần
        indexes: [
            { 
                fields: { userId: 1, productId: 1 },
                unique: true 
            }
        ]
    }
);

module.exports = mongoose.model('Favorite', favoriteSchema); 