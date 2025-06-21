const mongoose = require("mongoose");

const comboSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  products: {
    type: [String],
    default: [],
  },
  matcha: [
    {
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  note: [
    {
      title: {
        type: String,
        required: true,
      },
      note: {
        type: String,
        required: true,
      },
    },
  ],
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  suitableFor: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Combo = mongoose.model("Combo", comboSchema);

module.exports = Combo;
