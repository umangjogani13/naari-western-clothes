const mongoose = require('mongoose');

const valuePropSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'FREE SHIPPING'
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle / Description is required'],
    trim: true,
    default: 'On orders above ₹999'
  },
  icon: {
    type: String,
    required: [true, 'Icon identifier is required'],
    trim: true,
    default: 'FiTruck'
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

const ValueProp = mongoose.model('ValueProp', valuePropSchema);

module.exports = ValueProp;
