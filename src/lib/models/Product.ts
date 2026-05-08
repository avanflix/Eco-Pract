import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a product title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        index: true,
    },
    packSize: {
        type: String,
        required: [true, 'Please provide a pack size (e.g., Pack of 25)'],
    },
    images: {
        type: [String],
        required: [true, 'Please provide at least one image'],
    },
    hasPremium: {
        type: Boolean,
        default: false,
    },
    premiumImages: {
        type: [String],
        default: [],
    },
    variants: [
        {
            size: {
                type: String, // e.g., "10 inch", "12 inch"
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
            mrp: {
                type: Number,
                min: 0,
            },
            stock: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            sku: {
                type: String,
            },
            premiumPrice: {
                type: Number,
                min: 0,
            },
            premiumMrp: {
                type: Number,
                min: 0,
            },
            premiumStock: {
                type: Number,
                min: 0,
            },
        },
    ],
    isArchived: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create compound index for efficient querying if needed
ProductSchema.index({ category: 1, isArchived: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
