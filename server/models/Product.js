const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['shampoo', 'conditioner', 'hair-mask', 'serum', 'hair-oil'],
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        shortDescription: {
            type: String,
            maxlength: [300, 'Short description cannot exceed 300 characters'],
        },
        ingredients: [
            {
                type: String,
                trim: true,
            },
        ],
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        discountPrice: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                    // [REPLACE] with actual product image URLs
                    // default: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
                    default: 'https://images.unsplash.com/photo-1655892817271-c66841c2506e?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                alt: {
                    type: String,
                    default: 'Vertex Product Image',
                },
            },
        ],
        ratings: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        tags: [
            {
                type: String,
                lowercase: true,
            },
        ],
        weight: {
            type: String,
            default: '200ml',
        },
        benefits: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
});

// Indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });

// Auto-generate slug before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
