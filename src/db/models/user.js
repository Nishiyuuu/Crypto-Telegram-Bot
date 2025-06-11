const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    language: {
        type: String,
        enum: ['en', 'ua', 'ru', 'by'],
        default: 'en',
    }, 
    isVIP: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);