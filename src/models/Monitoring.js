const mongoose = require('mongoose');

const monitoringSchema = new mongoose.Schema({
  symbol:        { type: String, required: true },
  interval:      { type: Number, required: true },
  startPrice:    { type: Number, required: true },
  endPrice:      { type: Number, required: true },
  percentChange: { type: Number, required: true },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Monitoring', monitoringSchema);
