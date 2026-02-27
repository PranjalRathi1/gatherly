const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    console.log('📝 Signup attempt:', { username, email, hasPassword: !!password, displayName });

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: {
          username: !username ? 'Username is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
        field: 'password'
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        message: 'Username must be between 3 and 30 characters',
        field: 'username'
      });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log('❌ Signup failed: Email already exists');
      return res.status(409).json({
        message: 'Email already registered',
        field: 'email'
      });
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('❌ Signup failed: Username already taken');
      return res.status(409).json({
        message: 'Username already taken',
        field: 'username'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      displayName: displayName || username
    });

    // Generate token
    const token = generateToken(user);

    console.log('✅ User created successfully:', user.username);

    res.status(201).json({

      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        penguinEnabled: user.penguinEnabled,
        role: user.role,
        creatorRequestStatus: user.creatorRequestStatus
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        message: 'Validation failed',
        details: messages
      });
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        field
      });
    }

    // Generic server error
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);


    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        penguinEnabled: user.penguinEnabled,
        role: user.role,
        creatorRequestStatus: user.creatorRequestStatus
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { displayName } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.displayName = displayName || null;
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        penguinEnabled: user.penguinEnabled
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const requestCreatorRole = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'creator' || user.role === 'admin') {
      return res.status(400).json({ message: 'You already have creator access' });
    }

    user.creatorRequestStatus = 'pending';
    await user.save();

    res.json({ message: 'Creator access request submitted successfully' });

  } catch (error) {
    console.error('Request creator role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve creator request (Admin only)
// @route   POST /api/auth/approve-creator/:userId
// @access  Private (Admin)
const approveCreatorRequest = async (req, res) => {
  try {
    const adminUser = await User.findById(req.userId);

    // Check if current user is admin
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const userToApprove = await User.findById(req.params.userId);

    if (!userToApprove) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToApprove.creatorRequestStatus !== 'pending') {
      return res.status(400).json({ message: 'No pending request for this user' });
    }

    // Approve user
    userToApprove.role = 'creator';
    userToApprove.creatorRequestStatus = 'approved';
    await userToApprove.save();

    res.json({
      message: 'User approved as creator successfully',
      user: {
        id: userToApprove._id,
        username: userToApprove.username,
        email: userToApprove.email,
        role: userToApprove.role
      }
    });

  } catch (error) {
    console.error('Approve creator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all pending creator requests
// @route   GET /api/auth/pending-creators
// @access  Private (Admin)
const getPendingCreatorRequests = async (req, res) => {
  try {
    const adminUser = await User.findById(req.userId);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const pendingUsers = await User.find({ creatorRequestStatus: 'pending' })
      .select('username email creatorRequestStatus');

    res.json(pendingUsers);

  } catch (error) {
    console.error('Get pending creators error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Reject creator request (Admin only)
// @route POST /api/auth/reject-creator/:userId
// @access Private (Admin)
const rejectCreatorRequest = async (req, res) => {
  try {
    const adminUser = await User.findById(req.userId);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const userToReject = await User.findById(req.params.userId);

    if (!userToReject) {
      return res.status(404).json({ message: 'User not found' });
    }

    userToReject.creatorRequestStatus = 'rejected';
    await userToReject.save();

    res.json({
      message: 'Creator request rejected successfully'
    });

  } catch (error) {
    console.error('Reject creator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfile,
  requestCreatorRole,
  approveCreatorRequest,
  getPendingCreatorRequests,
  rejectCreatorRequest
};
