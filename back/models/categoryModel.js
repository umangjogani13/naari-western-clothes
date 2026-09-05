const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      lowercase: true,
      unique: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    subtitle: {
      type: String,
      default: '',
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Category thumbnail image is required'],
      default: '/images/cat_dresses.jpg'
    },
    bannerImage: {
      type: String,
      default: ''
    },
    subcategories: {
      type: [String],
      default: []
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    isFeatured: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Category', categorySchema);
