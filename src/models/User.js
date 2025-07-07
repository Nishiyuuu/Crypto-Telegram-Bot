const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  coins:      { type: [String], default: [] },
  status:     { type: String, enum: ['free','vip'], default: 'free' },
  language:   { type: String, default: 'en' },
  createdAt:  { type: Date, default: Date.now },
  monitorInterval:   { type: Number, default: 15000 }, // мс
  monitorThreshold:  { type: Number, default: 0.5 }    // %

});

module.exports = mongoose.model('User', userSchema);
