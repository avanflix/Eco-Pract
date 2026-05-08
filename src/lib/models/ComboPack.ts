import mongoose from 'mongoose';

const ComboItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: String, // Kept as string to allow "4x" or "4" flexibility, or strictly Number if preferred. User input was flexible.
        required: true,
    }
});

const ComboPackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    mrp: {
        type: Number,
    },
    items: {
        type: [ComboItemSchema],
        default: [],
    },
    textPosition: {
        type: String,
        enum: ['left', 'right'],
        default: 'left',
    }
}, { timestamps: true });

export default mongoose.models.ComboPack || mongoose.model('ComboPack', ComboPackSchema);
