const mongoose = require("mongoose");

const TeawareSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Tên dụng cụ, ví dụ: "Chawan"
  image: { type: String, required: false }, // Ảnh minh họa dụng cụ
});

const IngredientSchema = new mongoose.Schema({
  ingredient: { type: [String], required: true, trim: true }, // Tên nguyên liệu, ví dụ: "Matcha"
  image: { type: String, required: false }, // Ảnh minh họa nguyên liệu
});

const DirectionSchema = new mongoose.Schema({
  step: { type: String, required: true, trim: true }, // Nội dung bước, ví dụ: "Sieve matcha powder"
  image: { type: String, required: false }, // Ảnh minh họa bước
});

const ContentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true }, // Nội dung bước, ví dụ: "Sieve matcha powder"
  image: { type: String, required: false }, // Ảnh minh họa bước
});

const BlogSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Khám phá về Matcha", "Làm đẹp", "Pha chế"], // Dựa trên mảng blogs
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true, // Ánh xạ từ desc trong mảng blogs
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Thêm từ schema trước
    },
    thumbnailUrl: {
      type: String,
      required: false, // Ảnh chính, ánh xạ từ image trong mảng blogs
    },
    author: {
      type: String,
      required: false,
      default: "Kyomatcha Team", // Thêm từ schema trước
      trim: true,
    },
    content: {
      type: [ContentSchema], // Nội dung đầy đủ cho Tea Insights
      required: false,
    },
    teawares: {
      type: [TeawareSchema], // Dụng cụ cho Tea Recipes
      required: false,
    },
    ingredients: {
      type: [IngredientSchema], // Nguyên liệu cho Tea Recipes
      required: false,
    },
    directions: {
      type: [DirectionSchema], // Hướng dẫn cho Tea Recipes
      required: false,
    },
  },
  { timestamps: true }
);

// Tự động tạo slug từ title
BlogSchema.pre("save", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);