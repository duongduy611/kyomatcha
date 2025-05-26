const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    category: {type: String, required: true,},
    title: {type: String, required: true,},
    slug: {type: String, required: true, unique: true,},
    thumbnailUrl: {type: String, required: false,},
    author: {type: String, required: false, default: "Kyomatcha Team",},
    content: {type: String, required: true,},
    ingredients: {type: [String], required: false,},
    steps: {type: [String], required: false,}
}, { timestamps: true });

module.exports = mongoose.model("Blog", BlogSchema);
