const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkeyfornaariwesternclothes', {
    expiresIn: '7d',
  });
};

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, password } = req.body;

      // Basic input validation
      if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in MongoDB
      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword
      });
      await newUser.save();

      // Generate JWT token
      const token = generateToken(newUser._id);

      // Respond with token and user details (excluding password)
      const { password: _, ...userWithoutPassword } = newUser.toObject();
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration.' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Basic input validation
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // Generate token
      const token = generateToken(user._id);

      // Respond with token and user details (excluding password)
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login.' });
    }
  },

  // Get current user profile (protected route)
  getProfile: (req, res) => {
    // req.user is set by authMiddleware
    res.json(req.user);
  },

  // Update current user profile (protected route)
  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, phone, dob, gender } = req.body;
      const userId = req.user._id;

      // Validate required fields
      if (!firstName || !lastName || !phone) {
        return res.status(400).json({ message: 'First name, last name, and phone number are required.' });
      }

      // Update user details in MongoDB
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          phone,
          dob: dob || '',
          gender: gender || ''
        },
        { returnDocument: 'after' }
      ).select('-password').lean();

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found or update failed.' });
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Server error during profile update.' });
    }
  }
};

module.exports = authController;
