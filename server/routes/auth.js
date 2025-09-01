const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', { ...req.body, password: '[HIDDEN]' });
    
    const { username, email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'All fields are required: username, email, password, firstName, lastName' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      console.log('User already exists:', { email: existingUser.email, username: existingUser.username });
      return res.status(400).json({
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName
    });

    console.log('Saving new user to database...');
    await user.save();
    console.log('User saved successfully:', { userId: user._id, email: user.email });

    // Generate token
    const token = generateToken(user._id);
    console.log('JWT token generated for user:', user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email, password: '[HIDDEN]' });
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { userId: user._id, email: user.email });

    // Check password
    console.log('Verifying password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password verification failed for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Password verified successfully for user:', email);

    // Generate token
    const token = generateToken(user._id);
    console.log('JWT token generated for user:', user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Get user request for:', req.user._id);
    
    // Fetch fresh user data from database
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      console.log('User not found in database:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User data fetched successfully:', { userId: user._id, email: user.email });
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      updates.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// @route   GET /api/auth/test
// @desc    Test database connection and list users (for debugging)
// @access  Public
router.get('/test', async (req, res) => {
  try {
    console.log('Testing database connection...');
    
    // Test database connection
    const dbState = User.db.readyState;
    console.log('Database connection state:', dbState);
    
    // Count users
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    // Get all users (without passwords)
    const users = await User.find().select('-password').limit(10);
    console.log('Sample users:', users.map(u => ({ id: u._id, email: u.email, username: u.username })));
    
    res.json({
      message: 'Database test successful',
      dbState: dbState === 1 ? 'connected' : 'disconnected',
      userCount,
      sampleUsers: users.map(u => ({ id: u._id, email: u.email, username: u.username, firstName: u.firstName, lastName: u.lastName }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database test failed', 
      error: error.message 
    });
  }
});

// @route   GET /api/auth/purchased-stories
// @desc    Get user's purchased stories
// @access  Private
router.get('/purchased-stories', auth, async (req, res) => {
  try {
    console.log('Getting purchased stories for user:', req.user._id);
    
    const user = await User.findById(req.user._id).populate('purchasedStories');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Found purchased stories:', user.purchasedStories.length);
    res.json({ purchasedStories: user.purchasedStories });
  } catch (error) {
    console.error('Get purchased stories error:', error);
    res.status(500).json({ message: 'Server error getting purchased stories' });
  }
});

// @route   POST /api/auth/purchase-story
// @desc    Add a story to user's purchased list
// @access  Private
router.post('/purchase-story', auth, async (req, res) => {
  try {
    const { storyId } = req.body;
    
    if (!storyId) {
      return res.status(400).json({ message: 'Story ID is required' });
    }
    
    console.log('Adding story to purchased list:', { userId: req.user._id, storyId });
    
    // Check if story exists
    const Story = require('../models/Story');
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Check if user already purchased this story
    const user = await User.findById(req.user._id);
    if (user.purchasedStories.includes(storyId)) {
      return res.status(400).json({ message: 'Story already purchased' });
    }
    
    // Add story to purchased list
    user.purchasedStories.push(storyId);
    await user.save();
    
    console.log('Story added to purchased list successfully');
    res.json({ message: 'Story purchased successfully' });
  } catch (error) {
    console.error('Purchase story error:', error);
    res.status(500).json({ message: 'Server error purchasing story' });
  }
});

// @route   GET /api/auth/my-stories
// @desc    Get stories published by the current user
// @access  Private
router.get('/my-stories', auth, async (req, res) => {
  try {
    console.log('Getting stories published by user:', req.user._id);
    
    const Story = require('../models/Story');
    const stories = await Story.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    console.log('Found user stories:', stories.length);
    res.json({ stories });
  } catch (error) {
    console.error('Get my stories error:', error);
    res.status(500).json({ message: 'Server error getting user stories' });
  }
});

module.exports = router;
