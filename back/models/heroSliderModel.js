const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    trim: true,
    default: 'NEW COLLECTION'
  },
  title: {
    type: String,
    required: [true, 'Slide title is required'],
    trim: true,
    default: 'YOUR STYLE.\nYOUR STORY.'
  },
  description: {
    type: String,
    trim: true,
    default: 'Effortless fits for every you.'
  },
  image: {
    type: String,
    required: [true, 'Slide image URL or path is required'],
    trim: true,
    default: '/images/hero_banner.jpg'
  },
  primaryBtnText: {
    type: String,
    trim: true,
    default: 'SHOP NEW ARRIVALS'
  },
  primaryBtnLink: {
    type: String,
    trim: true,
    default: '#new-arrivals'
  },
  secondaryBtnText: {
    type: String,
    trim: true,
    default: 'EXPLORE COLLECTION'
  },
  secondaryBtnLink: {
    type: String,
    trim: true,
    default: '#categories'
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
