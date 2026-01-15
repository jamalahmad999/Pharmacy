const express = require('express');
const router = express.Router();
const Brand = require('../../models/Brand');
const { verifyToken } = require('../../middleware/auth');
const cloudinary = require('../../config/cloudinary');
const multer = require('multer');

// Configure multer for memory storage (no disk storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit for logos
});

// Upload brand logo to Cloudinary
router.post('/upload-logo', verifyToken, upload.single('logo'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary using upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'lifepharmacy/brands',
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'limit' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload logo to Cloudinary' });
        }

        res.json({ 
          success: true,
          logoUrl: result.secure_url 
        });
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const streamifier = require('streamifier');
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

// Get all brands
router.get('/', async (req, res) => {
  try {
    // Ensure database connection for serverless
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const database = require('../../config/database');
      await database.connect();
    }

    const brands = await Brand.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch brands',
      message: error.message 
    });
  }
});

// Get single brand
router.get('/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    res.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
});

// Create brand (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, slug, logo, description, website, order, isActive } = req.body;

    // Check if slug already exists
    const existingBrand = await Brand.findOne({ slug });
    if (existingBrand) {
      return res.status(400).json({ error: 'Brand with this slug already exists' });
    }

    const brand = new Brand({
      name,
      slug,
      logo,
      description,
      website,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({ error: 'Failed to create brand' });
  }
});

// Update brand (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, slug, logo, description, website, order, isActive } = req.body;

    // Check if slug is being changed and if it already exists
    if (slug) {
      const existingBrand = await Brand.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      if (existingBrand) {
        return res.status(400).json({ error: 'Brand with this slug already exists' });
      }
    }

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, slug, logo, description, website, order, isActive },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ error: 'Failed to update brand' });
  }
});

// Delete brand (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
});

module.exports = router;
