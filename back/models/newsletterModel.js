const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Subscribed', 'Unsubscribed'],
    default: 'Subscribed'
  },
  source: {
    type: String,
    default: 'Home Style Club Banner'
  }
}, {
  timestamps: true
});

const settingsSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'JOIN THE STYLE CLUB'
  },
  subtitle: {
    type: String,
    default: 'Get 10% OFF your first order and be the first to know about new arrivals & exclusive offers.'
  },
  discountBadge: {
    type: String,
    default: '10% OFF'
  },
  buttonText: {
    type: String,
    default: 'JOIN'
  },
  modelImage: {
    type: String,
    default: '/images/newsletter_model.jpg'
  },
  bgColor: {
    type: String,
    default: '#DFD7CD'
  }
}, {
  timestamps: true
});

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', subscriberSchema);
const NewsletterSettings = mongoose.model('NewsletterSettings', settingsSchema);

module.exports = {
  NewsletterSubscriber,
  NewsletterSettings
};
