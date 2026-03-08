const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

const GST_RATE = 0.18; // 18% GST
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    let itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discountAmount = 0;

    // Coupon validation
    if (couponCode) {
        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
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
        if (itemsPrice < coupon.minCartValue) {
            res.status(400);
            throw new Error(`Minimum cart value for this coupon is ₹${coupon.minCartValue}`);
        }

        if (coupon.discountType === 'percentage') {
            discountAmount = (itemsPrice * coupon.discountValue) / 100;
            if (coupon.maxDiscount > 0) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        } else {
            discountAmount = coupon.discountValue;
        }

        coupon.usedCount += 1;
        await coupon.save();
    }

    const priceAfterDiscount = itemsPrice - discountAmount;
    const gstAmount = Math.round(priceAfterDiscount * GST_RATE * 100) / 100;
    const shippingPrice = priceAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const totalPrice = priceAfterDiscount + gstAmount + shippingPrice;

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'cod',
        itemsPrice,
        gstAmount,
        shippingPrice,
        discountAmount,
        couponCode: couponCode?.toUpperCase() || '',
        totalPrice,
    });

    // Clear user cart after order
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
});

// @desc    Get logged-in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('orderItems.product', 'name images');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Check ownership or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }

    res.json({ success: true, order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    const totalRevenue = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
        success: true,
        count: orders.length,
        total,
        totalRevenue: totalRevenue[0]?.total || 0,
        orders,
    });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (orderStatus === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    await order.save();
    res.json({ success: true, message: 'Order status updated', order });
});

// @desc    Mark order as paid (after Razorpay verification)
// @route   PUT /api/orders/:id/pay
// @access  Private
const markOrderPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'confirmed';
    order.paymentResult = {
        // [REPLACE] Razorpay payment details from webhook/frontend verification
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_payment_id: req.body.razorpay_payment_id,
        razorpay_signature: req.body.razorpay_signature,
        status: 'completed',
        paidAt: new Date(),
    };

    await order.save();
    res.json({ success: true, message: 'Payment recorded', order });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, markOrderPaid };
