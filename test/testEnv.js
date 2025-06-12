const { BOT_TOKEN, ADMIN_ID, MONGO_URI } = require('../src/config/env');

console.log('BOT_TOKEN:', BOT_TOKEN ? 'Loaded' : 'Not Loaded');
console.log('ADMIN_ID:', ADMIN_ID);
console.log('MONGO_URI:', MONGO_URI ? 'Loaded' : 'Not Loaded');

// You should NOT log sensitive keys like Binance API/Secret in a real application.
// This is just for a quick test.