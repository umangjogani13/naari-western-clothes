const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  salePrice: {
    type: Number,
    default: null
  },
  oldPrice: {
    type: Number,
    default: null
  },
  discount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 50,
    min: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  brand: {
    type: String,
    default: 'Lavéra',
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Out of Stock'],
    default: 'Active'
  },
  image: {
    type: String,
    required: [true, 'Main product image is required'],
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  details: {
    type: String,
    trim: true,
    default: ''
  },
  sizeFit: {
    type: String,
    trim: true,
    default: ''
  },
  materialCare: {
    type: String,
    trim: true,
    default: ''
  },
  shippingReturns: {
    type: String,
    trim: true,
    default: 'Free shipping on orders above ₹999. Easy 7-day returns and exchanges.'
  },
  fabric: {
    type: String,
    default: 'Cotton',
    trim: true
  },
  colors: {
    type: [colorSchema],
    default: []
  },
  sizes: {
    type: [String],
    default: ['XS', 'S', 'M', 'L', 'XL']
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 25
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: true
  },
  isBestseller: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
