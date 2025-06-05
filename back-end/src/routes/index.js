const express = require("express");
const router = express.Router();

const cartRoutes = require("../routes/cartRoutes");
const orderRoutes = require("../routes/orderRoutes");
const paymentRouter = require('../routes/paymentRoutes');

router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use('/vietqr', paymentRouter);

module.exports = router;