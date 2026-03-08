const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
        res.status(400);
        throw new Error('Invalid or expired coupon code');
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        res.status(400);
        throw new Error('Coupon usage limit reached');
    }
    if (cartTotal && cartTotal < coupon.minCartValue) {
        res.status(400);
        throw new Error(`Minimum cart value for this coupon is ₹${coupon.minCartValue}`);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount > 0) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else {
        discountAmount = coupon.discountValue;
    }

    res.json({
        success: true,
        coupon: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            description: coupon.description,
        },
        discountAmount: Math.round(discountAmount * 100) / 100,
    });
});

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Admin
const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, coupons });
});

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Admin
const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created', coupon });
});

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Admin
const updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }
    res.json({ success: true, message: 'Coupon updated', coupon });
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }
    res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
