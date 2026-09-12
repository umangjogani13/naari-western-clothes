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

  // Customer / General Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user._id);
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error during login.' });
    }
  },

  // Admin Specific Login (Strictly verifies administrative permissions)
  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
      }

      const allowedRoles = ['Admin', 'Super Admin', 'Manager', 'Editor'];
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have administrator permissions.'
        });
      }

      if (user.status !== 'Active') {
        return res.status(403).json({
          success: false,
          message: 'Your administrator account has been deactivated. Please contact the administrator.'
        });
      }

      const token = generateToken(user._id);
      const { password: _, ...userWithoutPassword } = user.toObject();

      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ success: false, message: 'Server error during admin login.' });
    }
  },

  // Get current user profile (protected route)
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password').lean();
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({
        ...user,
        success: true,
        user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: 'Error retrieving profile' });
    }
  },

  // Update current user profile (protected route - for Customer or Admin)
  updateProfile: async (req, res) => {
    try {
      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        avatar, 
        dob, 
        gender, 
        currentPassword, 
        newPassword 
      } = req.body;
      const userId = req.user._id;

      const userDoc = await User.findById(userId);
      if (!userDoc) {
        return res.status(404).json({ success: false, message: 'User not found or update failed.' });
      }

      // If email is changing, verify it's not already taken
      if (email && email.toLowerCase() !== userDoc.email.toLowerCase()) {
        const emailExists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: userId } });
        if (emailExists) {
          return res.status(400).json({ success: false, message: 'This email is already in use by another account.' });
        }
        userDoc.email = email.toLowerCase().trim();
      }

      if (firstName) userDoc.firstName = firstName.trim();
      if (lastName !== undefined) userDoc.lastName = lastName.trim();
      if (phone) userDoc.phone = phone.trim();
      if (avatar !== undefined) userDoc.avatar = avatar;
      if (dob !== undefined) userDoc.dob = dob;
      if (gender !== undefined) userDoc.gender = gender;

      // Handle password update
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ success: false, message: 'Current password is required to change password.' });
        }
        const isMatch = await bcrypt.compare(currentPassword, userDoc.password);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        }
        if (newPassword.length < 6) {
          return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
        }
        const salt = await bcrypt.genSalt(10);
        userDoc.password = await bcrypt.hash(newPassword, salt);
      }

      await userDoc.save();

      const { password: _, ...userWithoutPassword } = userDoc.toObject();

      res.status(200).json({
        ...userWithoutPassword,
        success: true,
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ success: false, message: 'Server error during profile update.' });
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
