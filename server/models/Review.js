const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
        helpful: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Each user can review a product only once
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ rating: -1 });

// Static method to update product rating after review save/delete
reviewSchema.statics.calcAverageRatings = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    if (stats.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratings: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].nRating,
        });
    } else {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratings: 0,
            numReviews: 0,
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post('remove', function () {
    this.constructor.calcAverageRatings(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
