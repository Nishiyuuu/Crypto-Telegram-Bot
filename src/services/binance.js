const Binance = require('binance-api-node').default;
const { BINANCE_API_KEY, BINANCE_SECRET_KEY } = require('../config/env');
const logger = require('../utils/logger');

const client = Binance({
    apiKey: BINANCE_API_KEY,
    apiSecret: BINANCE_SECRET_KEY,
});

const getPrice = async (symbol) => {
    try {
        // Binance usually uses 'USDT' as the quote asset for common pairs
        const symbolPair = symbol.toUpperCase() + 'USDT'; 
        const prices = await client.prices({ symbol: symbolPair });
        const price = parseFloat(prices[symbolPair]);
        if (isNaN(price)) {
            logger.warn(`Price for ${symbolPair} is not a valid number.`);
            return null;
        }
        return price;
    } catch (error) {
        if (error.code === -1121) { // Invalid symbol error from Binance
            logger.info(`Binance API: Symbol ${symbol} not found.`);
        } else {
            logger.error(`Binance API error for ${symbol}:`, error);
        }
        return null;
    }
};

module.exports = {
    getPrice,
    // You can add more Binance related functions here if needed, e.g., getKlines, getExchangeInfo etc.
};