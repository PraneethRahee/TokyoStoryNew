const mongoose = require('mongoose');

const snapshotItemSchema = new mongoose.Schema({
  storyId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  imageUrl: { type: String }
}, { _id: false });

const checkoutSnapshotSchema = new mongoose.Schema({
  key: { type: String, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [snapshotItemSchema],
  meta: { type: Object },
  expiresAt: { type: Date, index: { expires: '2h' } } // auto-delete after 2 hours
}, { timestamps: true });

module.exports = mongoose.model('CheckoutSnapshot', checkoutSnapshotSchema);
