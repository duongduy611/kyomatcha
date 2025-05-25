const express = require("express");
const router = express.Router();

const cartRoutes = require("../routes/cartRoutes");
const orderRoutes = require("../routes/orderRoutes");
const authRouter = require('../routes/authRoutes');
// const userRoutes = require("../routes/userRoutes");

// router.use("/login", authRoutes);
// router.use("/orders", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/api", authRouter); // /auth
// router.use("/users", userRoutes);

module.exports = router;