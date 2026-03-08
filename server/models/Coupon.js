const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Coupon code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            enum: ['percentage', 'flat'],
            default: 'percentage',
        },
        discountValue: {
            type: Number,
            required: [true, 'Discount value is required'],
            min: [1, 'Discount must be at least 1'],
        },
        minCartValue: {
            type: Number,
            default: 0,
        },
        maxDiscount: {
            type: Number,
            default: 0, // 0 means no cap
        },
        usageLimit: {
            type: Number,
            default: 0, // 0 means unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            required: [true, 'Expiry date is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        description: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);


couponSchema.index({ isActive: 1 });
couponSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
