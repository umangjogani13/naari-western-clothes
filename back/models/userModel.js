const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  dob: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;
