const express = require("express");
const router = express.Router();

// const productRoutes = require("../routes/productRoutes");
const orderRoutes = require("../routes/orderRoutes");
// const userRoutes = require("../routes/userRoutes");

// router.use("/login", authRoutes);
// router.use("/orders", productRoutes);
router.use("/orders", orderRoutes);
// router.use("/users", userRoutes);

module.exports = router;