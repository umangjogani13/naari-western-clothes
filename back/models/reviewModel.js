const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    default: 5,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true
  },
  productName: {
    type: String,
    default: 'LAVÉRA Collection',
    trim: true
  },
  productImage: {
    type: String,
    default: '/images/prod_dress.jpg',
    trim: true
  },
  isFeaturedOnHome: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Published', 'Pending'],
    default: 'Published'
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
