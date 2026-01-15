const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => 'ORD' + Date.now()
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    emirate: { type: String, required: true },
    country: { type: String, default: 'UAE' },
    zipCode: String
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String
  }],
  paymentMethod: {
    type: String,
    enum: ['card', 'cod', 'stripe'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String, // Stripe payment ID
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  orderNotes: String,
  trackingNumber: String
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
