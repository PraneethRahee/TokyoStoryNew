const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const purchaseItemSchema = new mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
  title: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 }
}, { _id: false });

const cartItemSchema = new mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  imageUrl: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  purchasedStories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],

  cartItems: [cartItemSchema],
  raffleEntries: { type: Number, default: 0 },
  raffleHistory: [{
    tickets: { type: Number, required: true },
    amount: { type: Number, required: true }, 
    sessionId: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  purchaseHistory: [{
    items: [purchaseItemSchema],
    amount: { type: Number, required: true }, 
    sessionId: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
