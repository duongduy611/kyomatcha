const express = require("express");
const router = express.Router();

const cartRoutes = require("../routes/cartRoutes");
const orderRoutes = require("../routes/orderRoutes");
const authRouter = require('../routes/authRoutes');
const productRouter = require('../routes/product');


router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/api", authRouter); // /auth
router.use('/api', productRouter);

module.exports = router;