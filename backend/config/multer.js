const multer = require('multer');
const path = require('path');

// Configure storage for products (memory storage for serverless)
const productStorage = multer.memoryStorage();

// Configure storage for brands (memory storage for serverless)
const brandStorage = multer.memoryStorage();

// Configure storage for categories (memory storage for serverless)
const categoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Multer upload instances
const productUpload = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

const brandUpload = multer({
  storage: brandStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for brand logos
  fileFilter: fileFilter
});

const categoryUpload = multer({
  storage: categoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for category images
  fileFilter: fileFilter
});

module.exports = {
  productUpload,
  brandUpload,
  categoryUpload,
  upload: productUpload // backward compatibility
};
