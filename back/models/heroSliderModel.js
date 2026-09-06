const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    trim: true,
    default: ''
  },
  title: {
    type: String,
    required: [true, 'Slide title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    required: [true, 'Slide image URL or path is required'],
    trim: true
  },
  primaryBtnText: {
    type: String,
    trim: true,
    default: ''
  },
  primaryBtnLink: {
    type: String,
    trim: true,
    default: ''
  },
  secondaryBtnText: {
    type: String,
    trim: true,
    default: ''
  },
  secondaryBtnLink: {
    type: String,
    trim: true,
    default: ''
  },
  order: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  bgColor: {
    type: String,
    trim: true,
    default: '#EAE3DB'
  }
}, {
  timestamps: true
});

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);

module.exports = HeroSlide;
