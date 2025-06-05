const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone:    { type: String },
  address:  { type: String },
  role:     { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
  status:   { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  isDeleted: { type: Boolean, default: false },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);