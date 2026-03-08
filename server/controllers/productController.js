const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const { category, sort, search, page = 1, limit = 12, featured, bestseller } = req.query;

    const query = {};
    if (category) query.category = category;
    if (featured) query.isFeatured = true;
    if (bestseller) query.isBestSeller = true;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { ratings: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit));

    res.json({
        success: true,
        count: products.length,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        products,
    });
});

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' },
    });

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Get related products (same category, excluding current)
    const related = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
    }).limit(4);

    res.json({ success: true, product, related });
});

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', product });
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json({ success: true, message: 'Product updated', product });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };
