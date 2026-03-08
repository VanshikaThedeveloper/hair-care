const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: req.user._id, product: productId });
    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this product');
    }

    // Check if user purchased this product
    const hasPurchased = await Order.findOne({
        user: req.user._id,
        'orderItems.product': productId,
        isDelivered: true,
    });

    const review = await Review.create({
        user: req.user._id,
        product: productId,
        name: req.user.name,
        rating,
        comment,
        isVerifiedPurchase: !!hasPurchased,
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', review });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }
    if (review.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this review');
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    res.json({ success: true, message: 'Review updated', review });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
});

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Admin
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find()
        .populate('user', 'name email')
        .populate('product', 'name')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
});

module.exports = { getProductReviews, createReview, updateReview, deleteReview, getAllReviews };
