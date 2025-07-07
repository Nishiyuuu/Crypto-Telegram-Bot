const logger = require('./logger');

/**
 * Middleware для обробки помилок у callback_query
 */
function handleCallbackQueryError(handler) {
  return async (query) => {
    try {
      await handler(query);
    } catch (error) {
      logger.error(`Error in callback query handler:`, error);
      // Можна додати сповіщення користувачу про помилку
      // await bot.sendMessage(query.message.chat.id, 'Виникла помилка. Спробуйте пізніше.');
    }
  };
}

/**
 * Middleware для обробки помилок у message handlers
 */
function handleMessageError(handler) {
  return async (msg) => {
    try {
      await handler(msg);
    } catch (error) {
      logger.error(`Error in message handler:`, error);
      // Можна додати сповіщення користувачу про помилку
      // await bot.sendMessage(msg.chat.id, 'Виникла помилка. Спробуйте пізніше.');
    }
  };
}

/**
 * Wrapper для безпечного виконання асинхронних операцій
 */
function safeAsync(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error('Error in async operation:', error);
      throw error;
    }
  };
}

module.exports = {
  handleCallbackQueryError,
  handleMessageError,
  safeAsync
};
