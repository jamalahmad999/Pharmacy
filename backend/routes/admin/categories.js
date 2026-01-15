const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const { verifyToken } = require('../../middleware/auth');
const { categoryUpload } = require('../../config/multer');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

// Get all categories
router.get('/', async (req, res) => {
  try {
    // Ensure database connection for serverless
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const database = require('../../config/database');
      await database.connect();
    }

    const categories = await Category.find()
      .populate({
        path: 'parentCategory',
        populate: {
          path: 'parentCategory',
          select: 'name slug'
        }
      })
      .sort({ order: 1, name: 1 })
      .lean();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      message: error.message 
    });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate({
        path: 'parentCategory',
        populate: {
          path: 'parentCategory',
          select: 'name slug'
        }
      });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create category (admin only)
router.post('/', verifyToken, categoryUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, slug, icon, description, parentCategory, order, isActive } = req.body;

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this slug already exists' });
    }

    let imageUrl = null;
    let bannerUrl = null;

    // Upload image if provided
    if (req.files?.image?.[0]) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'categories' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.files.image[0].buffer).pipe(uploadStream);
      });
      imageUrl = result.secure_url;
    }

    // Upload banner if provided
    if (req.files?.banner?.[0]) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'categories/banners' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.files.banner[0].buffer).pipe(uploadStream);
      });
      bannerUrl = result.secure_url;
    }

    const category = new Category({
      name,
      slug,
      icon,
      description,
      image: imageUrl,
      banner: bannerUrl,
      parentCategory: parentCategory || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', verifyToken, categoryUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, slug, icon, description, parentCategory, order, isActive } = req.body;

    // Check if slug is being changed and if it already exists
    if (slug) {
      const existingCategory = await Category.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      if (existingCategory) {
        return res.status(400).json({ error: 'Category with this slug already exists' });
      }
    }

    // Get current category to check if we need to update image
    const currentCategory = await Category.findById(req.params.id);
    if (!currentCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updateData = {
      name,
      slug,
      icon,
      description,
      parentCategory: parentCategory || null,
      order,
      isActive
    };

    // Upload new image if provided
    if (req.files?.image?.[0]) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'categories' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.files.image[0].buffer).pipe(uploadStream);
      });
      updateData.image = result.secure_url;
    }

    // Upload new banner if provided
    if (req.files?.banner?.[0]) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'categories/banners' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.files.banner[0].buffer).pipe(uploadStream);
      });
      updateData.banner = result.secure_url;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
