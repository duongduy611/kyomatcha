const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const Combo = require("../models/ComboModel");
const User = require("../models/UserModel");

// @desc    Get all orders (admin) with enriched item details
// @route   GET /admin/orders
// @access  Admin
exports.getOrders = async (req, res) => {
  try {
    // 1️⃣ Lấy về orders (chưa xóa) kèm thông tin user
    let orders = await Order.find({ isDeleted: false })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // 2️⃣ Enrich từng item: lookup Product hoặc Combo
    const enriched = await Promise.all(
      orders.map(async (order) => {
        order.items = await Promise.all(
          order.items.map(async (item) => {
            // — Product đơn lẻ —
            if (item.name) {
              const prod = await Product.findById(item.productId)
                .select("name images")
                .lean();
              return {
                ...item,
                kind: "Product",
                name: prod?.name || item.name,
                images: prod?.images || [],
              };
            }

            // — Combo —
            if (item.productId) {
              const combo = await Combo.findById(item.productId)
                .select("title matcha images")
                .lean();
              if (combo) {
                const variant = Array.isArray(combo.matcha)
                  ? combo.matcha.find((m) => m.title === item.title) || null
                  : null;
                return {
                  ...item,
                  kind: "Combo",
                  comboTitle: combo.title,
                  comboImages: combo.images,
                  variant: variant
                    ? {
                        title: variant.title,
                        image: variant.image,
                        price: variant.price,
                      }
                    : null,
                };
              }
            }

            // — Fallback —
            return { ...item, kind: "Unknown" };
          })
        );
        return order;
      })
    );

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders: enriched,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "Server error while fetching orders",
      error: error.message,
    });
  }
};

// @desc    Get a single order by ID (admin)
// @route   GET /admin/order/:id
// @access  Admin
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Lấy order, lean() để có object thuần
    let order = await Order.findOne({ _id: id, isDeleted: false })
      .populate("userId", "fullName email")
      .lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Enrich từng item tương tự getOrders
    order.items = await Promise.all(
      order.items.map(async (item) => {
        // — Product đơn lẻ —
        if (item.productId && !item.title) {
          const prod = await Product.findById(item.productId)
            .select("name images")
            .lean();
          return {
            ...item,
            kind: "Product",
            name: prod?.name || item.name,
            images: prod?.images || [],
          };
        }
        // — Combo —
        if (item.productId && item.title) {
          const combo = await Combo.findById(item.productId)
            .select("title matcha images")
            .lean();
          // tìm variant matcha để lấy ảnh
          const variant = Array.isArray(combo.matcha)
            ? combo.matcha.find((m) => m.title === item.title)
            : null;
          return {
            ...item,
            kind: "Combo",
            comboTitle: combo.title,
            images: variant?.image ? [variant.image] : combo.images || [],
          };
        }
        // — Fallback —
        return { ...item, images: [] };
      })
    );

    return res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      message: "Server error while fetching order",
      error: error.message,
    });
  }
};

// @desc    Update order status (admin)
// @route   PATCH /admin/order/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid or missing status" });
    }

    // 1️⃣ Cập nhật status, lấy về doc MỚI
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { status },
      { new: true }
    ).lean();
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Enrich ảnh cho từng item giống getOrders
    const enrichedItems = await Promise.all(
      updatedOrder.items.map(async (item) => {
        // Nếu là product đơn lẻ
        if (item.productId && !item.title) {
          const prod = await Product.findById(item.productId)
            .select("images")
            .lean();
          return {
            ...item,
            images: prod?.images || [],
          };
        }
        // Nếu là combo
        if (item.productId && item.title) {
          const combo = await Combo.findById(item.productId)
            .select("images matcha")
            .lean();
          // tìm variant matcha tương ứng để lấy ảnh nếu có
          const variant = Array.isArray(combo.matcha)
            ? combo.matcha.find((m) => m.title === item.title)
            : null;
          return {
            ...item,
            images: variant?.image ? [variant.image] : combo?.images || [],
          };
        }
        // fallback
        return { ...item, images: [] };
      })
    );

    updatedOrder.items = enrichedItems;

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      message: "Server error while updating status",
      error: error.message,
    });
  }
};

// @desc    Soft delete an order (admin)
// @route   DELETE /admin/order/:id
// @access  Admin
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or already deleted" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({
      message: "Server error while deleting order",
      error: error.message,
    });
  }
};

/**
 * @desc    Add a new product
 * @route   POST /admin/products
 * @access  Admin
 */
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      shortDescription,
      stock,
      images,
      subCategory,
      subPrice,
      status,
    } = req.body;

    // Validation cơ bản
    if (!name || !category || !price) {
      //
      return res
        .status(400)
        .json({ message: "Tên, danh mục và giá là các trường bắt buộc" }); //
    }

    // Tự động tạo slug từ tên sản phẩm
    const generatedSlug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, ""); //

    // Kiểm tra xem slug đã tồn tại chưa để đảm bảo tính duy nhất
    const existingProduct = await Product.findOne({ slug: generatedSlug }); //
    if (existingProduct) {
      return res
        .status(400)
        .json({
          message:
            "Sản phẩm có tên này đã tồn tại. Vui lòng chọn một tên khác.",
        });
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      //
      name, //
      slug: generatedSlug, //
      category, //
      price, //
      description, //
      shortDescription, //
      stock, //
      images, //
      subCategory, //
      subPrice, //
      status, //
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({
      message: "Lỗi máy chủ khi thêm sản phẩm",
      error: error.message,
    });
  }
};

/**
 * @desc    Update a product by ID
 * @route   PUT /admin/products/:id
 * @access  Admin
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Nếu tên sản phẩm được cập nhật, tạo lại slug
    if (updateData.name) {
      const newSlug = updateData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      // Kiểm tra slug mới có trùng với sản phẩm khác không
      const existingProduct = await Product.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Một sản phẩm khác có tên này đã tồn tại." });
      }
      updateData.slug = newSlug; //
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Trả về tài liệu đã được cập nhật
      runValidators: true, // Chạy các trình xác thực của schema
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({
      message: "Lỗi máy chủ khi cập nhật sản phẩm",
      error: error.message,
    });
  }
};

/**
 * @desc    Soft delete a product by ID
 * @route   DELETE /admin/products/:id
 * @access  Admin
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Tìm và cập nhật trường isDeleted thành true
    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false }, //
      { isDeleted: true }, //
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm hoặc sản phẩm đã bị xóa" });
    }

    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({
      message: "Lỗi máy chủ khi xóa sản phẩm",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all users with pagination
 * @route   GET /admin/users
 * @access  Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
      totalUsers: users.length
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};

/**
 * @desc    Update a user's status (ACTIVE/INACTIVE)
 * @route   PATCH /admin/users/:id/status
 * @access  Admin
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: `User status updated to ${status}`,
      data: user,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      message: "Server error while updating user status",
      error: error.message,
    });
  }
};


/**
 * @desc    Get dashboard statistics
 * @route   GET /admin/stats
 * @access  Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Chạy các query song song để tối ưu tốc độ
    const [totalUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false }),
      Order.countDocuments({ isDeleted: false }),
      Order.aggregate([
        {
          $match: { status: "DELIVERED" } // Chỉ tính doanh thu từ các đơn đã giao thành công
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" }
          }
        }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      message: "Statistics retrieved successfully",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      message: "Server error while fetching dashboard stats",
      error: error.message,
    });
  }
};