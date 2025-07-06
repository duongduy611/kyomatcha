const express = require('express');
const {
	getOrders,
	getOrderById,
	updateOrderStatus,
	deleteOrder,
	addProduct,
	updateProduct,
	deleteProduct,
    getAllUsers,
    updateUserStatus,
    getDashboardStats,
    updateUserRole,
} = require('../controllers/AdminController');
// const auth = require('../middleware/auth');

const router = express.Router();


// === DASHBOARD ROUTES ===
router.get('/stats', getDashboardStats);


// === ORDER ROUTES ===
router.get('/orders' , getOrders);
router.get('/orders/:id' ,getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id' ,deleteOrder);


// === PRODUCT ROUTES ===
router.post('/products' ,addProduct);
router.put('/products/:id' ,updateProduct);
router.delete('/products/:id' ,deleteProduct);


// === USER MANAGEMENT ROUTES ===
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;