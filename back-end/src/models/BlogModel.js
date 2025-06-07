const mongoose = require("mongoose");

const TeawareSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: false },
});

const IngredientSchema = new mongoose.Schema({
  ingredient: { type: [String], required: true, trim: true },
  image: { type: String, required: false },
});

const DirectionSchema = new mongoose.Schema({
  step: { type: String, required: true, trim: true },
  image: { type: String, required: false },
});

const ContentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  image: { type: String, required: false },
});

const BlogSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Khám phá", "Làm đẹp", "Pha chế"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
      default: "Duong Duy",
      trim: true,
    },
    content: {
      type: [ContentSchema],
      required: false,
    },
    teawares: {
      type: [TeawareSchema],
      required: false,
    },
    ingredients: {
      type: [IngredientSchema],
      required: false,
    },
    directions: {
      type: [DirectionSchema],
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