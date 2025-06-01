const express = require('express');
const router = express.Router();
const Favorite = require('../models/FavoriteModel');
const auth = require('../middleware/auth');

// Lấy danh sách sản phẩm yêu thích của user
router.get('/', auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user._id })
            .populate('productId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: favorites
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Toggle trạng thái yêu thích của sản phẩm
router.post('/toggle', auth, async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        // Kiểm tra xem sản phẩm đã được yêu thích chưa
        const existingFavorite = await Favorite.findOne({ userId, productId });

        if (existingFavorite) {
            // Nếu đã tồn tại, xóa khỏi danh sách yêu thích
            await Favorite.deleteOne({ _id: existingFavorite._id });
            res.json({
                success: true,
                data: {
                    isFavorite: false,
                    message: 'Đã xóa khỏi danh sách yêu thích'
                }
            });
        } else {
            // Nếu chưa tồn tại, thêm vào danh sách yêu thích
            const newFavorite = await Favorite.create({ userId, productId });
            res.json({
                success: true,
                data: {
                    isFavorite: true,
                    favorite: newFavorite,
                    message: 'Đã thêm vào danh sách yêu thích'
                }
            });
        }
    } catch (error) {
        // Xử lý lỗi duplicate key (user đã yêu thích sản phẩm này)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Sản phẩm đã có trong danh sách yêu thích'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Kiểm tra trạng thái yêu thích của một sản phẩm
router.get('/check/:productId', auth, async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            userId: req.user._id,
            productId: req.params.productId
        });

        res.json({
            success: true,
            data: {
                isFavorite: !!favorite
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Lấy số lượng yêu thích của một sản phẩm
router.get('/count/:productId', async (req, res) => {
    try {
        const count = await Favorite.countDocuments({
            productId: req.params.productId
        });

        res.json({
            success: true,
            data: {
                count
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 