import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true,
        enum: ['hero', 'categories', 'combo-packs', 'best-sellers', 'testimonials'],
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Allows flexible structure for different sections
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
