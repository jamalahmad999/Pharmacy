const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const { verifyToken, isAdmin } = require('../../middleware/auth');
const cloudinary = require('../../config/cloudinary');
const multer = require('multer');

// Configure multer for memory storage (no disk storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload product image to Cloudinary
router.post('/upload-image', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary using upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'lifepharmacy/products',
        resource_type: 'image',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
        }

        res.json({ 
          success: true, 
          message: 'Image uploaded successfully',
          imageUrl: result.secure_url
        });
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const streamifier = require('streamifier');
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get all products (with filters, pagination, search)
router.get('/products', verifyToken, isAdmin, async (req, res) => {
  try {
    // Ensure database connection for serverless
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const database = require('../../config/database');
      await database.connect();
    }

    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      category = '', 
      isActive = '',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);

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
    console.error('Error fetching products:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Get single product by ID
router.get('/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug icon');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create new product
router.post('/products', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      discount,
      sku,
      stock,
      category,
      subcategory,
      brand,
      images,
      tags,
      specifications,
      isActive,
      isFeatured
    } = req.body;

    // Validate required fields
    if (!name || !slug || !description || !price || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, slug, description, price, category' 
      });
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this slug already exists' });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const product = new Product({
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      discount: discount || 0,
      sku,
      stock: stock || 0,
      category,
      subcategory,
      brand,
      images: images || [],
      tags: tags || [],
      specifications: specifications || [],
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false
    });

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug icon');

    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully',
      data: populatedProduct 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If slug is being updated, check for duplicates
    if (updates.slug && updates.slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug: updates.slug });
      if (existingProduct) {
        return res.status(400).json({ error: 'Product with this slug already exists' });
      }
    }

    // If category is being updated, verify it exists
    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('category', 'name slug icon');

    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.findByIdAndDelete(id);

    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Bulk delete products
router.post('/products/bulk-delete', verifyToken, isAdmin, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid product IDs' });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });

    res.json({ 
      success: true, 
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    res.status(500).json({ error: 'Failed to delete products' });
  }
});

// ============ CATEGORY ROUTES ============

// Get all categories
router.get('/categories', verifyToken, isAdmin, async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name slug')
      .sort({ order: 1, name: 1 })
      .lean();

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single category by ID
router.get('/categories/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name slug');

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create new category
router.post('/categories', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, slug, icon, description, image, parentCategory, order, isActive } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this slug already exists' });
    }

    const category = new Category({
      name,
      slug,
      icon: icon || '📦',
      description,
      image,
      parentCategory: parentCategory || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await category.save();

    const populatedCategory = await Category.findById(category._id)
      .populate('parentCategory', 'name slug');

    res.status(201).json({ 
      success: true, 
      message: 'Category created successfully',
      data: populatedCategory 
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/categories/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // If slug is being updated, check for duplicates
    if (updates.slug && updates.slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug: updates.slug });
      if (existingCategory) {
        return res.status(400).json({ error: 'Category with this slug already exists' });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name slug');

    res.json({ 
      success: true, 
      message: 'Category updated successfully',
      data: updatedCategory 
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/categories/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if there are products using this category
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. ${productsCount} products are using this category.` 
      });
    }

    // Check if there are child categories
    const childCategories = await Category.countDocuments({ parentCategory: id });
    if (childCategories > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. ${childCategories} subcategories exist under this category.` 
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get statistics for dashboard
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      lowStockProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Category.countDocuments(),
      Product.countDocuments({ stock: { $lt: 10 } })
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        totalCategories,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
