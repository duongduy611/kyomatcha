const express = require("express");
const router = express.Router();

const cartRoutes = require("../routes/cartRoutes");
const orderRoutes = require("../routes/orderRoutes");
const paymentRouter = require('../routes/paymentRoutes');
const userRouter = require('../routes/userRouter');
const comboRoutes = require('../routes/comboRoutes');

router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use('/payment', paymentRouter);
router.use('/users', userRouter);
router.use('/combo', comboRoutes);

module.exports = router;