const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Feature title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Feature description is required'],
    trim: true
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
    default: ''
  },
  subheading: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  features: [featureSchema]
}, {
  timestamps: true
});

const WhyShop = mongoose.model('WhyShop', whyShopSchema);

module.exports = WhyShop;
