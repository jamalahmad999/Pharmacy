const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    // Ensure database connection for serverless
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const database = require('../config/database');
      await database.connect();
    }

    console.log('📦 Fetching products...');
    
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      category = '',
      brand = '',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const products = await Product.find(query)
      .populate('category', 'name slug icon')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);
    
    console.log(`✅ Found ${products.length} products (Total: ${total})${brand ? ` for brand: ${brand}` : ''}`);

    res.json({ 
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Get all categories (public) - Must be before /:slug route
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select('name slug icon description parentCategory')
      .populate('parentCategory', 'name slug')
      .sort({ order: 1, name: 1 })
      .lean();

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single product by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug,
      isActive: true 
    }).populate('category', 'name slug icon');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
