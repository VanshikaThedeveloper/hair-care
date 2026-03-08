const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

const products = [
    {
        name: 'Vertex Luxury Herbal Shampoo',
        category: 'shampoo',
        description:
            'Our signature luxury shampoo, crafted with rare botanical extracts and precious oils. Transforms your hair with every wash, leaving it silky, voluminous, and radiantly healthy.',
        shortDescription: 'Signature luxury shampoo with rare botanical extracts for silky, voluminous hair.',
        ingredients: [
            'Argan Oil', 'Biotin', 'Keratin', 'Aloe Vera', 'Vitamin E',
            'Rosemary Extract', 'Panthenol', 'Hydrolyzed Silk Protein',
        ],
        price: 899,
        discountPrice: 699,
        stock: 150,
        isFeatured: true,
        isBestSeller: true,
        weight: '300ml',
        benefits: ['Deep cleansing', 'Adds volume', 'Reduces frizz', 'Strengthens hair'],
        tags: ['luxury', 'shampoo', 'argan', 'biotin'],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&q=80',
                alt: 'Vertex Luxury Shampoo',
            },
        ],
        ratings: 4.8,
        numReviews: 124,
    },
    {
        name: 'Vertex Deep Silk Conditioner',
        category: 'conditioner',
        description:
            'An ultra-rich deep conditioning treatment formulated with shea butter, coconut milk, and 12 essential amino acids. Restores moisture, repairs damage, and leaves hair irresistibly soft.',
        shortDescription: 'Ultra-rich deep conditioner with shea butter and 12 amino acids for silky-soft hair.',
        ingredients: [
            'Shea Butter', 'Coconut Milk', 'Argan Oil', 'Amino Acids Complex',
            'Jojoba Oil', 'Vitamin B5', 'Glycerin', 'Cetyl Alcohol',
        ],
        price: 799,
        discountPrice: 599,
        stock: 120,
        isFeatured: true,
        isBestSeller: true,
        weight: '300ml',
        benefits: ['Deep moisturization', 'Damage repair', 'Detangling', 'Color protection'],
        tags: ['conditioner', 'shea butter', 'deep conditioning', 'luxury'],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&q=80',
                alt: 'Vertex Deep Conditioner',
            },
        ],
        ratings: 4.7,
        numReviews: 98,
    },
    {
        name: 'Vertex 24K Gold Hair Mask',
        category: 'hair-mask',
        description:
            'The crown jewel of our collection. This intensive hair mask combines 24k gold particles with a blend of luxury oils and proteins to deliver unparalleled shine, strength, and softness.',
        shortDescription: 'Intensive 24k gold-infused hair mask for unparalleled shine and strength.',
        ingredients: [
            '24K Gold Particles', 'Moroccan Argan Oil', 'Keratin', 'Collagen',
            'Black Seed Oil', 'Vitamin C', 'Hyaluronic Acid', 'Silk Amino Acids',
        ],
        price: 1299,
        discountPrice: 999,
        stock: 80,
        isFeatured: true,
        isBestSeller: true,
        weight: '200ml',
        benefits: ['Intensive repair', 'Mirror shine', 'Strengthens', 'Reduces breakage by 95%'],
        tags: ['hair-mask', 'gold', 'intensive', 'premium', 'luxury'],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80',
                alt: 'Vertex Gold Hair Mask',
            },
        ],
        ratings: 4.9,
        numReviews: 67,
    },
    {
        name: 'Vertex Nano-Peptide Serum',
        category: 'serum',
        description:
            'A lightweight, fast-absorbing hair serum powered by encapsulated Argan Oil and nano-peptides. Adds brilliant shine, controls frizz, and protects against heat up to 230°C.',
        shortDescription: 'Lightweight serum with nano-peptides for brilliant shine and heat protection up to 230°C.',
        ingredients: [
            'Encapsulated Argan Oil', 'Nano-Peptides', 'Dimethicone',
            'Cyclopentasiloxane', 'Vitamin E Acetate', 'Perfluorodecalin',
        ],
        price: 999,
        discountPrice: 799,
        stock: 200,
        isFeatured: false,
        isBestSeller: true,
        weight: '100ml',
        benefits: ['Heat protection 230°C', 'Frizz control', 'Instant shine', 'Lightweight formula'],
        tags: ['serum', 'heat protection', 'frizz control', 'shine'],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1655892817271-c66841c2506e?q=80&w=1174&auto=format&fit=crop',
                alt: 'Vertex Elixir Serum',
            },
        ],
        ratings: 4.6,
        numReviews: 156,
    },
    {
        name: 'Vertex Scalp Revival Hair Oil',
        category: 'hair-oil',
        description:
            'A blend of 9 rare cold-pressed oils that nourishes the scalp, strengthens roots, and promotes remarkable hair growth. Rooted in ancient Ayurvedic wisdom, perfected by modern science.',
        shortDescription: 'Blend of 9 cold-pressed oils for scalp nourishment and remarkable hair growth.',
        ingredients: [
            'Cold-Pressed Castor Oil', 'Bhringraj Extract', 'Rosemary Oil',
            'Peppermint Oil', 'Amla Oil', 'Jojoba Oil', 'Sweet Almond Oil',
            'Vitamin E', 'Lavender Essential Oil',
        ],
        price: 749,
        discountPrice: 549,
        stock: 175,
        isFeatured: true,
        isBestSeller: false,
        weight: '150ml',
        benefits: ['Promotes hair growth', 'Scalp nourishment', 'Reduces hair fall', 'Strengthens roots'],
        tags: ['hair-oil', 'growth', 'scalp', 'ayurvedic', 'castor oil'],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
                alt: 'Vertex Scalp Revival Oil',
            },
        ],
        ratings: 4.5,
        numReviews: 89,
    },
];

const coupons = [
    {
        code: 'VERTEX10',
        discountType: 'percentage',
        discountValue: 10,
        minCartValue: 500,
        maxDiscount: 200,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        description: '10% off on orders above ₹500',
        isActive: true,
    },
    {
        code: 'WELCOME20',
        discountType: 'percentage',
        discountValue: 20,
        minCartValue: 1000,
        maxDiscount: 500,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        description: '20% off on first order above ₹1000',
        isActive: true,
    },
    {
        code: 'FLAT100',
        discountType: 'flat',
        discountValue: 100,
        minCartValue: 599,
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        description: '₹100 flat off on orders above ₹599',
        isActive: true,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Clear existing data
        await Product.deleteMany({});
        await Review.deleteMany({});
        await Coupon.deleteMany({});
        console.log('🗑️  Cleared existing products, reviews, and coupons');

        // Seed products
        const createdProducts = await Product.create(products);
        console.log(`🛍️  ${createdProducts.length} products seeded`);

        // Seed coupons
        await Coupon.insertMany(coupons);
        console.log(`🎟️  ${coupons.length} coupons seeded`);

        // Create admin user if doesn't exist
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@vertex.com' });
        if (!adminExists) {
            await User.create({
                name: 'Vertex Admin',
                email: process.env.ADMIN_EMAIL || 'admin@vertex.com',
                password: process.env.ADMIN_PASSWORD || 'Admin@123456',
                role: 'admin',
            });
            console.log('👤 Admin user created');
        } else {
            console.log('👤 Admin user already exists');
        }

        console.log('\n✨ Database seeded successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin Login:');
        console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@vertex.com'}`);
        console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
