const express = require('express');
const router = express.Router();
const {
    getProductReviews, createReview, updateReview, deleteReview, getAllReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/', protect, isAdmin, getAllReviews);

module.exports = router;
