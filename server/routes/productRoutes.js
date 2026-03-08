const express = require('express');
const router = express.Router();
const {
    getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
