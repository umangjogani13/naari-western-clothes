const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: { type: String, required: true },
  option: { type: String, default: '' },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 },
  total: { type: Number, required: true },
  image: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      address: { type: String, default: '' }
    },
    items: [orderItemSchema],
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    cod: { type: Number, default: 0 },
    coupon: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    total: { type: Number, required: true },
    rawAmount: { type: Number, default: 0 },
    payment: {
      method: { type: String, default: 'UPI' },
      paymentId: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    notes: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
