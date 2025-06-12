// src/bot/commands/price.js

const logger = require('../../utils/logger');
const { getPrice } = require('../../services/binance'); 

// Функція для обробки команди "Ціна"
// Тепер приймає символ як окремий аргумент
const handlePriceCommand = async (ctx, symbolInput) => { // <--- ЗМІНА ТУТ: ДОДАНО symbolInput
    const userId = ctx.from.id; // ctx.from.id тепер буде працювати, бо ctx - справжній
    const userLang = ctx.session.language; 

    let symbol = '';

    // Якщо символ передано явно (з bot.on('text')), використовуємо його
    if (symbolInput) {
        symbol = symbolInput.toUpperCase();
    } 
    // Якщо символ не передано явно, шукаємо його в тексті команди (для /price BTC)
    else if (ctx.message && ctx.message.text) {
        const textParts = ctx.message.text.split(' ');
        if (textParts.length > 1) { // Це для випадку /price BTC
            symbol = textParts[1].toUpperCase(); 
        }
    } 
    
    // Якщо символ все ще не визначений (користувач натиснув кнопку "Ціна" і ми чекаємо ввід)
    if (!symbol) {
        // Ми НЕ будемо тут просити ввести символ, бо цей сценарій обробляє bot.hears для "💰 Ціна"
        // handlePriceCommand викликається, коли символ вже має бути отриманий або запрошений.
        // Це означає, що сюди ми потрапимо, лише якщо щось пішло не так.
        logger.warn(`handlePriceCommand called without a symbol for user ${userId}. This should not happen.`);
        await ctx.reply(ctx.i18n('general_error')); 
        return; 
    }

    const price = await getPrice(symbol); 

    if (price !== null) {
        const formattedPrice = new Intl.NumberFormat(userLang === 'ua' ? 'uk-UA' : 'en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 8 
        }).format(price);

        await ctx.reply(ctx.i18n('price_response', { symbol: symbol, price: formattedPrice })); 
    } else {
        await ctx.reply(ctx.i18n('price_not_found', { symbol: symbol })); 
    }
};

module.exports = {
    handlePriceCommand
};