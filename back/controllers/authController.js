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
  },

  // Admin: Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
      res.json({
        success: true,
        users: users.map(u => ({
          _id: u._id,
          id: u._id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User',
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          role: u.role || 'Customer',
          status: u.status || 'Active',
          createdAt: u.createdAt
        }))
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Server error fetching users' });
    }
  },

  // Admin: Create user
  createUser: async (req, res) => {
    try {
      const { name, firstName, lastName, email, phone, role, status, password } = req.body;
      let fName = firstName;
      let lName = lastName;
      if (!fName && name) {
        const parts = name.trim().split(' ');
        fName = parts[0];
        lName = parts.slice(1).join(' ') || '';
      }
      fName = fName || 'New';
      lName = lName || 'User';

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'password123', salt);

      const user = new User({
        firstName: fName,
        lastName: lName,
        email: email.toLowerCase(),
        phone: phone || '0000000000',
        password: hashedPassword,
        role: role || 'Editor',
        status: status || 'Active'
      });
      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          _id: user._id,
          id: user._id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ success: false, message: 'Server error creating user' });
    }
  },

  // Admin: Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, firstName, lastName, email, role, status } = req.body;
      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (name && !firstName) {
        const parts = name.trim().split(' ');
        updateData.firstName = parts[0];
        updateData.lastName = parts.slice(1).join(' ') || '';
      }
      if (email) updateData.email = email.toLowerCase();
      if (role) updateData.role = role;
      if (status) updateData.status = status;

      const updated = await User.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).select('-password').lean();
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        user: {
          _id: updated._id,
          id: updated._id,
          name: `${updated.firstName} ${updated.lastName}`.trim(),
          email: updated.email,
          role: updated.role,
          status: updated.status
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ success: false, message: 'Server error updating user' });
    }
  },

  // Admin: Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ success: false, message: 'Server error deleting user' });
    }
  }
};

module.exports = authController;
