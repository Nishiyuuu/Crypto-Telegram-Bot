require('dotenv').config();
const Binance = require('binance-api-node').default;
const Monitoring = require('./models/Monitoring');

const client = Binance();

/**
 * Перевіряє зміни цін монет
 * @param {string[]} coins
 * @param {number} interval
 * @param {number} percentThreshold
 * @returns {Promise<string[]>}
 */
async function monitorPrices(coins, interval, percentThreshold) {
  const alerts = [];

  for (const symbol of coins) {
    const ticker = await client.prices({ symbol });
    const currentPrice = parseFloat(ticker[symbol]);

    const last = await Monitoring.findOne({ symbol }).sort({ createdAt: -1 });
    if (!last) {
      await Monitoring.create({ symbol, interval, startPrice: currentPrice, endPrice: currentPrice, percentChange: 0 });
      continue;
    }

    const change = ((currentPrice - last.endPrice) / last.endPrice) * 100;
    if (Math.abs(change) >= percentThreshold) {
      alerts.push(`🚨 ${symbol} змінилась на ${change.toFixed(2)}%: ${last.endPrice} → ${currentPrice}`);
      await Monitoring.create({ symbol, interval, startPrice: last.endPrice, endPrice: currentPrice, percentChange: change });
    }
  }

  return alerts;
}

module.exports = monitorPrices;
