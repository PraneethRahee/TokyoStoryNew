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

// Configure CORS for production frontend and localhost
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:5000',
  'https://localhost:5000'
].filter(Boolean);

const corsOptions = {
  origin: function(origin, callback) {
    console.log('CORS origin check:', { origin, allowedOrigins });
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Normalize multiple slashes in URL path (e.g., //payment-success -> /payment-success)
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

async function connectToMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://raheepraneeth69:LolLol999@cluster0.zegngzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    return false;
  }
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/payments', require('./routes/payments'));

// Redirect Stripe return routes from backend to frontend domain in production
app.get(['/payment-success', '/payment-cancelled'], (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:3000';
  const query = req.originalUrl.split('?')[1];
  // Normalize any accidental double slashes to a single slash
  const normalizedPath = (`/${req.path}`).replace(/\/+/, '/');
  const target = `${frontendUrl.replace(/\/$/, '')}${normalizedPath}${query ? `?${query}` : ''}`;
  console.log(`🔁 Redirecting ${req.path} to frontend:`, target);
  res.redirect(302, target);
});

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  console.log('✅ API test route accessed');
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Add a simple health check route
app.get('/api/health', (req, res) => {
  console.log('✅ Health check route accessed');
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test route to serve React app directly
app.get('/test-react', (req, res) => {
  console.log('🧪 Testing React app serving');
  const indexPath = path.join(__dirname, '../client/build', 'index.html');
  const fs = require('fs');
  
  if (fs.existsSync(indexPath)) {
    console.log('✅ Serving React app from test route');
    res.sendFile(indexPath);
  } else {
    console.log('❌ React app not found in test route');
    res.status(404).json({ error: 'React app not found', path: indexPath });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    path: req.path,
    method: req.method,
    message: err.message,
    stack: err.stack
  });
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
});

if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle client-side routing - serve index.html for all non-API routes
  // This must be the LAST route to avoid intercepting API routes
  app.get('*', (req, res) => {
    console.log('Serving React app for route:', req.path);
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:3000`);
    console.log(`🔧 Backend API: http://localhost:${PORT}/api`);
  });
}

startServer();
