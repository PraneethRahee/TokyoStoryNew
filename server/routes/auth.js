const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'All fields are required: username, email, password, firstName, lastName' 
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    if (error.code === 11000) {
      const fields = Object.keys(error.keyPattern || {});
      const field = fields[0] || 'field';
      const msg = field === 'email' 
        ? 'Email already registered' 
        : field === 'username' 
          ? 'Username already taken' 
          : `Duplicate ${field}`;
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

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

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) {
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

router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});


router.get('/purchased-stories', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('purchasedStories');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ purchasedStories: user.purchasedStories });
  } catch (error) {
    console.error('Get purchased stories error:', error);
    res.status(500).json({ message: 'Server error getting purchased stories' });
  }
});

router.post('/purchase-story', auth, async (req, res) => {
  try {
    const { storyId } = req.body;
    
    if (!storyId) {
      return res.status(400).json({ message: 'Story ID is required' });
    }
    
    const Story = require('../models/Story');
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    const user = await User.findById(req.user._id);
    if (user.purchasedStories.includes(storyId)) {
      return res.status(400).json({ message: 'Story already purchased' });
    }
    
    user.purchasedStories.push(storyId);
    await user.save();
    
    res.json({ message: 'Story purchased successfully' });
  } catch (error) {
    console.error('Purchase story error:', error);
    res.status(500).json({ message: 'Server error purchasing story' });
  }
});

router.get('/my-stories', auth, async (req, res) => {
  try {
    const Story = require('../models/Story');
    const stories = await Story.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    res.json({ stories });
  } catch (error) {
    console.error('Get my stories error:', error);
    res.status(500).json({ message: 'Server error getting user stories' });
  }
});

router.post('/raffle-entry', auth, async (req, res) => {
  try {
    const { tickets, amount, sessionId } = req.body;
    if (!tickets || tickets < 1 || !amount) {
      return res.status(400).json({ message: 'tickets and amount are required' });
    }
    const user = await User.findById(req.user._id);
    user.raffleEntries += Number(tickets);
    user.raffleHistory.push({ tickets: Number(tickets), amount: Number(amount), sessionId });
    await user.save();
    res.json({ message: 'Raffle entry recorded', raffleEntries: user.raffleEntries });
  } catch (error) {
    console.error('Record raffle entry error:', error);
    res.status(500).json({ message: 'Server error recording raffle entry' });
  }
});

router.post('/record-purchase', auth, async (req, res) => {
  try {
    const { items, amount, sessionId } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !amount) {
      return res.status(400).json({ message: 'items and amount are required' });
    }

    const user = await User.findById(req.user._id);
    user.purchaseHistory.push({ items, amount: Number(amount), sessionId });
    await user.save();
    res.json({ message: 'Purchase recorded' });
  } catch (error) {
    console.error('Record purchase error:', error);
    res.status(500).json({ message: 'Server error recording purchase' });
  }
});

router.post('/purchase-stories', auth, async (req, res) => {
  try {
    const { storyIds } = req.body;
    if (!Array.isArray(storyIds) || storyIds.length === 0) {
      return res.status(400).json({ message: 'storyIds are required' });
    }
    const user = await User.findById(req.user._id);

    const toAdd = [];
    const set = new Set((user.purchasedStories || []).map(id => String(id)));
    for (const id of storyIds) {
      if (!set.has(String(id))) {
        toAdd.push(id);
      }
    }
    if (toAdd.length > 0) {
      user.purchasedStories.push(...toAdd);
      await user.save();
    }
    res.json({ message: 'Stories added to purchased list', added: toAdd.length });
  } catch (error) {
    console.error('Bulk purchase stories error:', error);
    res.status(500).json({ message: 'Server error adding purchased stories' });
  }
});

router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ items: user.cartItems || [] });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error getting cart' });
  }
});

router.post('/cart', auth, async (req, res) => {
  try {
    const { storyId, title, price, imageUrl } = req.body;
    if (!storyId || !title || typeof price !== 'number') {
      return res.status(400).json({ message: 'storyId, title and price are required' });
    }
    const user = await User.findById(req.user._id);
    const existing = (user.cartItems || []).find(i => String(i.storyId) === String(storyId));
    if (existing) {
      existing.quantity += 1;
    } else {
      user.cartItems.push({ storyId, title, price, quantity: 1, imageUrl });
    }
    await user.save();
    res.json({ items: user.cartItems });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
});

router.patch('/cart/quantity', auth, async (req, res) => {
  try {
    const { storyId, quantity } = req.body;
    if (!storyId || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: 'storyId and valid quantity are required' });
    }
    const user = await User.findById(req.user._id);
    const item = (user.cartItems || []).find(i => String(i.storyId) === String(storyId));
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    item.quantity = quantity;
    await user.save();
    res.json({ items: user.cartItems });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    res.status(500).json({ message: 'Server error updating cart quantity' });
  }
});

router.delete('/cart/:storyId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cartItems = (user.cartItems || []).filter(i => String(i.storyId) !== String(req.params.storyId));
    await user.save();
    res.json({ items: user.cartItems });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error removing from cart' });
  }
});

router.delete('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cartItems = [];
    await user.save();
    res.json({ items: user.cartItems });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
});

router.get('/payment-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('purchaseHistory raffleHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      purchaseHistory: user.purchaseHistory || [],
      raffleHistory: user.raffleHistory || []
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error getting payment history' });
  }
});

module.exports = router;
