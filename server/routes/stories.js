const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const mongoose = require('mongoose');
const { optionalAuth } = require('../middleware/auth');

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.json([]);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ message: 'Error fetching story' });
  }
});

// Get stories by user
router.get('/user/:userId', async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ message: 'Error fetching user stories' });
  }
});

router.post('/add', optionalAuth, upload.single('image'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available. Please try again later.',
        error: 'MongoDB connection not established'
      });
    }
    
    const { title, name, email, description } = req.body;
    
    if (!title || !name || !email || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      const story = new Story({
        title,
        name,
        email,
        description,
        imageUrl: 'https://via.placeholder.com/800x600?text=Tokyo+Lore'
      });
      
      const savedStory = await story.save();
      return res.status(201).json(savedStory);
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'tokyo-lore',
      transformation: [
        { width: 800, height: 600, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    const storyData = {
      title,
      name,
      email,
      description,
      imageUrl: cloudinaryResponse.secure_url
    };

    // If user is authenticated, link the story to their account
    if (req.user) {
      storyData.userId = req.user._id;
    }

    const story = new Story(storyData);

    const savedStory = await story.save();
    res.status(201).json(savedStory);
  } catch (error) {
    console.error('Error creating story:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    if (error.name === 'MongooseError' && error.message.includes('bufferCommands')) {
      return res.status(503).json({ 
        message: 'Database connection issue. Please try again.',
        error: 'MongoDB not ready'
      });
    }
    
    res.status(500).json({ message: 'Error creating story' });
  }
});

module.exports = router;
