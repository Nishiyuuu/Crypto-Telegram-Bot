
require('dotenv').config();
const Binance = require('binance-api-node').default;
const Monitoring = require('./models/Monitoring');

const client = Binance();

/**
 * Перевіряє зміни цін монет
 * @param {Array<string>} coins - масив монет, наприклад ['BTCUSDT', 'ETHUSDT']
 * @param {number} interval - інтервал перевірки в мілісекундах
 * @param {number} percentThreshold - відсоток зміни для тригера алерту
 * @returns {Promise<Array<string>>} - масив повідомлень для алерту
 */


async function monitorPrices(coins, interval, percentThreshold) {
  const alerts = [];

  for (const symbol of coins) {
    const ticker = await client.prices({ symbol });
    const currentPrice = parseFloat(ticker[symbol]);

    // Тут ти можеш завантажувати попередню ціну з кешу або БД. Ми просто використовуємо Monitoring як логгер.
    const lastEntry = await Monitoring.findOne({ symbol }).sort({ createdAt: -1 });

    if (!lastEntry) {
      await Monitoring.create({
        symbol,
        interval,
        startPrice: currentPrice,
        endPrice: currentPrice,
        percentChange: 0,
      });
      continue;
    }

    const percentChange = ((currentPrice - lastEntry.endPrice) / lastEntry.endPrice) * 100;

    if (Math.abs(percentChange) >= percentThreshold) {
      alerts.push(`🚨 ${symbol} змінилась на ${percentChange.toFixed(2)}%\n${lastEntry.endPrice} → ${currentPrice}`);

      await Monitoring.create({
        symbol,
        interval,
        startPrice: lastEntry.endPrice,
        endPrice: currentPrice,
        percentChange,
      });
    }
  }

  return alerts;
}

module.exports = monitorPrices;