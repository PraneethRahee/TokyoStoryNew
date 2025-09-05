const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(helmet());

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  if (typeof req.url === 'string' && req.url.startsWith('/')) {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Restored to normal rate limit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);


async function connectToMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://raheepraneeth69:LolLol999@cluster0.zegngzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/payments', require('./routes/payments'));

app.get(['/payment-success', '/payment-cancelled'], (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:3000';
  const query = req.originalUrl.split('?')[1];
  const normalizedPath = (`/${req.path}`).replace(/\/+/, '/');
  const target = `${frontendUrl.replace(/\/$/, '')}${normalizedPath}${query ? `?${query}` : ''}`;
  res.redirect(302, target);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
