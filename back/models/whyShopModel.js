const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Feature title is required'],
    trim: true,
    default: 'Premium Quality'
  },
  description: {
    type: String,
    required: [true, 'Feature description is required'],
    trim: true,
    default: 'Finest fabrics, rigorous checking, and attention to detail in every single stitch.'
  },
  icon: {
    type: String,
    trim: true,
    default: 'FiAward'
  },
  iconBg: {
    type: String,
    trim: true,
    default: '#F5EFE6'
  },
  order: {
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

const whyShopSchema = new mongoose.Schema({
  heading: {
    type: String,
    trim: true,
    default: 'WHY SHOP WITH LAVÉRA?'
  },
  subheading: {
    type: String,
    trim: true,
    default: 'DESIGNED FOR YOU. LOVED BY THOUSANDS.'
  },
  image: {
    type: String,
    trim: true,
    default: '/images/promo_look.jpg'
  },
  features: [featureSchema]
}, {
  timestamps: true
});

const WhyShop = mongoose.model('WhyShop', whyShopSchema);

module.exports = WhyShop;
