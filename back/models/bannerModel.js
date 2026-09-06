const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true,
    default: ''
  },
  tag: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    required: [true, 'Banner image is required'],
    trim: true
  },
  link: {
    type: String,
    default: '/shop',
    trim: true
  },
  buttonText: {
    type: String,
    default: 'EXPLORE NOW',
    trim: true
  },
  bgColor: {
    type: String,
    default: '#EAE3DB',
    trim: true
  },
  placement: {
    type: String,
    enum: ['Promo Banner', 'Homepage Slider', 'Category Page', 'Product Page'],
    default: 'Promo Banner'
  },
  displayOrder: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
