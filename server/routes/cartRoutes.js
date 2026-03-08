const express = require('express');
const router = express.Router();
const {
    getCart, addToCart, updateCart, removeFromCart, clearCart, toggleWishlist
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect); // All cart routes are protected
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCart);
router.delete('/', clearCart);
router.delete('/:productId', removeFromCart);
router.post('/wishlist/:productId', toggleWishlist);

module.exports = router;
