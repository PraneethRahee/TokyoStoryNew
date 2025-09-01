# Tokyo Lore - Stories from the Heart of Japan

A full-stack storytelling platform where users can discover and share captivating tales from Tokyo's vibrant culture and history.

## 🌟 Features

- **User Authentication**: Secure JWT-based login and signup system
- **User Profiles**: Manage account settings and view personal statistics
- **Story Discovery**: Browse and search through a collection of Tokyo stories
- **Story Submission**: Submit your own Tokyo experiences with images
- **Image Upload**: Direct upload to Cloudinary with automatic optimization
- **Payment Integration**: Stripe-powered donation system to support the platform
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Search**: Instant search functionality across stories
- **Modern UI**: Beautiful interface built with TailwindCSS and Shadcn components
- **Protected Routes**: Secure access to user-specific features

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and verification
- **Multer** - File upload handling
- **Cloudinary** - Image storage and optimization
- **Stripe** - Payment processing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tokyo-lore
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cp env.example .env
   
   # Edit .env with your credentials
   nano .env
   ```

4. **Configure Environment Variables**
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/tokyo-lore
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

## 📁 Project Structure

```
tokyo-lore/
├── server/                 # Backend code
│   ├── index.js           # Express server setup
│   ├── models/            # Mongoose schemas
│   │   ├── Story.js       # Story model
│   │   └── User.js        # User model
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # Authentication middleware
│   └── routes/            # API routes
│       ├── auth.js        # Authentication endpoints
│       ├── stories.js     # Story endpoints
│       └── payments.js    # Payment endpoints
├── client/                # Frontend code
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/change-password` - Change password (protected)

### Stories
- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get single story
- `GET /api/stories/user/:userId` - Get stories by user
- `POST /api/stories/add` - Submit new story (with image, optional auth)

### Payments
- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/session/:id` - Get session details

## 🎨 Design Features

- **Responsive Grid Layout**: Stories displayed in responsive cards
- **Floating Payment Widget**: Bottom-right corner Stripe integration
- **Image Optimization**: Automatic Cloudinary transformations
- **Smooth Animations**: CSS transitions and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation
- **SEO Optimized**: Meta tags and structured data

## 🚀 Deployment

### Replit Deployment

1. **Create a new Replit project**
2. **Upload the code** or connect your GitHub repository
3. **Set environment variables** in Replit Secrets:
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. **Install dependencies**:
   ```bash
   npm run install-all
   ```
5. **Start the application**:
   ```bash
   npm start
   ```

### Production Build

```bash
# Build the React app
cd client
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **Rate Limiting**: API endpoints protected against abuse
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Image type and size validation
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet.js**: Security headers middleware

## 📱 Mobile Responsiveness

- **Mobile-first design** with TailwindCSS
- **Touch-friendly** interface elements
- **Optimized images** for different screen sizes
- **Responsive navigation** with hamburger menu
- **Floating payment widget** adapts to mobile screens

## 🧪 Testing

### Stripe Testing
Use these test card numbers for payment testing:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expired**: `4000 0000 0000 0069`

### API Testing
Test the endpoints using tools like Postman or curl:
```bash
# Get all stories
curl http://localhost:5000/api/stories

# Submit a story (requires multipart form data)
curl -X POST http://localhost:5000/api/stories/add \
  -F "title=My Tokyo Story" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "description=Amazing experience in Tokyo..." \
  -F "image=@/path/to/image.jpg"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TailwindCSS** for the beautiful utility-first CSS framework
- **Lucide** for the amazing icon set
- **Cloudinary** for image storage and optimization
- **Stripe** for secure payment processing
- **MongoDB** for the flexible database solution

## 📞 Support

For support, email hello@tokyolore.com or create an issue in this repository.

---

Made with ❤️ for Tokyo and its amazing stories.
