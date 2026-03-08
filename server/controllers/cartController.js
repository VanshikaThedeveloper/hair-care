const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.product', 'name price images stock category');

    const cartItems = user.cart.map((item) => ({
        _id: item._id,
        product: item.product,
        quantity: item.quantity,
    }));

    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.json({ success: true, cart: cartItems, subtotal });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    if (product.stock < quantity) {
        res.status(400);
        throw new Error(`Only ${product.stock} items available in stock`);
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
    } else {
        user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json({ success: true, message: 'Item added to cart', cartCount: user.cart.length });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCart = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.find((item) => item.product.toString() === req.params.productId);

    if (!item) {
        res.status(404);
        throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
        user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId);
    } else {
        item.quantity = quantity;
    }

    await user.save();
    res.json({ success: true, message: 'Cart updated' });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId);
    await user.save();
    res.json({ success: true, message: 'Item removed from cart' });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ success: true, message: 'Cart cleared' });
});

// @desc    Toggle wishlist
// @route   POST /api/cart/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const isInWishlist = user.wishlist.includes(productId);

    if (isInWishlist) {
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
        user.wishlist.push(productId);
    }

    await user.save();
    res.json({
        success: true,
        message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
        inWishlist: !isInWishlist,
    });
});

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart, toggleWishlist };
