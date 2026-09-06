const mongoose = require('mongoose');

const instagramSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image path or URL is required'],
    trim: true
  },
  caption: {
    type: String,
    trim: true,
    default: 'Styling LAVÉRA western essentials ✨'
  },
  postUrl: {
    type: String,
    trim: true,
    default: 'https://instagram.com'
  },
  likesCount: {
    type: Number,
    default: 120
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

const InstagramPost = mongoose.model('InstagramPost', instagramSchema);

module.exports = InstagramPost;
