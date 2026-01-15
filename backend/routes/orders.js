const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      items,
      paymentMethod,
      paymentId,
      subtotal,
      tax,
      shipping,
      total,
      orderNotes
    } = req.body;

    // Validate required fields
    if (!customerInfo || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information'
      });
    }

    // Create order
    const order = new Order({
      customerInfo,
      shippingAddress,
      items,
      paymentMethod,
      paymentId,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal,
      tax,
      shipping,
      total,
      orderNotes
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    // First, try to connect to database if not connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const database = require('../config/database');
      await database.connect();
    }

    const orders = await Order.find()
      .populate({
        path: 'items.product',
        select: 'name slug images price',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get order by order number
router.get('/:orderNumber', async (req, res) => {
  try {
    // Ensure database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const database = require('../config/database');
      await database.connect();
    }

    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate({
        path: 'items.product',
        select: 'name slug images price',
        options: { strictPopulate: false }
      })
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update order status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, trackingNumber },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
});

// Create Stripe payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'aed' } = req.body;

    // For demo purposes, return a mock payment intent
    // In production, integrate with Stripe:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Convert to fils (smallest currency unit)
    //   currency: currency,
    //   automatic_payment_methods: { enabled: true },
    // });

    const mockPaymentIntent = {
      id: 'pi_' + Date.now(),
      client_secret: 'demo_secret_' + Date.now(),
      amount: amount,
      currency: currency
    };

    res.json({
      success: true,
      data: mockPaymentIntent
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
});

module.exports = router;
