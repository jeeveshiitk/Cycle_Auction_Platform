const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    brand: { 
        type: String, 
        required: true 
    },
    condition: { 
        type: String, 
        required: true 
    },
    basePrice: { 
        type: Number, 
        required: true 
    },
    currentHighestBid: { 
        type: Number, 
        default: 0 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Cycle', cycleSchema);