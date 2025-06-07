const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

router.get('/:userId', cartController.getCartByUserId);
router.post('/add', cartController.addToCart);
router.post('/decrease', cartController.decreaseQuantityFromCart);
router.post('/increase', cartController.increaseQuantityFromCart);
router.post('/remove', cartController.removeFromCart);
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;