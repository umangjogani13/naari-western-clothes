const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'shipping'],
      default: 'percentage'
    },
    discount: {
      type: String,
      default: '10% OFF'
    },
    discountVal: {
      type: Number,
      required: true,
      default: 10
    },
    minOrder: {
      type: Number,
      default: 999
    },
    expiry: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Inactive'],
      default: 'Active'
    },
    usedCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Coupon', couponSchema);
