const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema ({
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
    percent: {
        type: Number,
        required: true,
    },
    interval: {
        type: Number,
        default: 10,
    },
    active: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('Alert', alertSchema);