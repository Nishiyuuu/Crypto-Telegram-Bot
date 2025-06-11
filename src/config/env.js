require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_SECRET_KEY = process.env.BINANCE_SECRET_KEY;
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_ID = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(id => id.trim()).map(Number) : [];

module.exports = {
    BOT_TOKEN,
    BINANCE_API_KEY,
    BINANCE_SECRET_KEY,
    MONGO_URI,
    ADMIN_ID,
};