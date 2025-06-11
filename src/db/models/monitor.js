const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    coin: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Monitor', monitorSchema);