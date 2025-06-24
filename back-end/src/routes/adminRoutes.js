const express = require('express');
const {
	getOrders,
	getOrderById,
	updateOrderStatus,
	deleteOrder,
} = require('../controllers/AdminController');
// const auth = require('../middleware/auth');

const router = express.Router();

router.get('/orders' , getOrders);

router.get('/orders/:id' ,getOrderById);

router.patch('/orders/:id/status', updateOrderStatus);

router.delete('/orders/:id' ,deleteOrder);


module.exports = router;
