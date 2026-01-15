const express = require('express');
const router = express.Router();

// Import admin routes
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const brandsRouter = require('./brands');
const usersRouter = require('./users');

// Mount routes
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/brands', brandsRouter);
router.use('/users', usersRouter);

module.exports = router;