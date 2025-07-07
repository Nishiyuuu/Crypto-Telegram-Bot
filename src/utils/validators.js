const config = require('../config/config');
const Binance = require('binance-api-node').default;
const client = Binance();

/**
 * Валідація символів криптовалют
 */
async function validateSymbols(symbols) {
  const valid = [];
  const invalid = [];
  
  for (const symbol of symbols) {
    try {
      // Перевіряємо формат символу
      if (!config.VALIDATION.SYMBOL_PATTERN.test(symbol)) {
        invalid.push(symbol);
        continue;
      }
      
      // Перевіряємо існування на Binance
      const ticker = await client.dailyStats({ symbol });
      if (ticker && ticker.symbol === symbol) {
        valid.push(symbol);
      } else {
        invalid.push(symbol);
      }
    } catch (error) {
      invalid.push(symbol);
    }
  }
  
  return { valid, invalid };
}

/**
 * Валідація інтервалу моніторингу
 */
function validateInterval(interval, userStatus = 'free') {
  const limits = config[`${userStatus.toUpperCase()}_LIMITS`];
  
  if (typeof interval !== 'number' || isNaN(interval)) {
    return { isValid: false, error: 'Interval must be a number' };
  }
  
  const seconds = interval;
  if (seconds < config.VALIDATION.INTERVAL_MIN) {
    return { isValid: false, error: `Minimum interval is ${config.VALIDATION.INTERVAL_MIN} seconds` };
  }
  
  const maxSeconds = limits.MAX_INTERVAL / 1000;
  if (seconds > maxSeconds) {
    return { isValid: false, error: `Maximum interval for ${userStatus} users is ${maxSeconds} seconds` };
  }
  
  return { isValid: true, value: seconds * 1000 };
}

/**
 * Валідація порогу зміни ціни
 */
function validateThreshold(threshold, userStatus = 'free') {
  const limits = config[`${userStatus.toUpperCase()}_LIMITS`];
  
  if (typeof threshold !== 'number' || isNaN(threshold)) {
    return { isValid: false, error: 'Threshold must be a number' };
  }
  
  if (threshold < config.VALIDATION.THRESHOLD_MIN) {
    return { isValid: false, error: `Minimum threshold is ${config.VALIDATION.THRESHOLD_MIN}%` };
  }
  
  if (threshold > limits.MAX_THRESHOLD) {
    return { isValid: false, error: `Maximum threshold for ${userStatus} users is ${limits.MAX_THRESHOLD}%` };
  }
  
  return { isValid: true, value: threshold };
}

/**
 * Валідація кількості монет
 */
function validateCoinsCount(coinsCount, userStatus = 'free') {
  const limits = config[`${userStatus.toUpperCase()}_LIMITS`];
  
  if (coinsCount > limits.MAX_COINS) {
    return { 
      isValid: false, 
      error: `Maximum coins for ${userStatus} users is ${limits.MAX_COINS}` 
    };
  }
  
  return { isValid: true, value: coinsCount };
}

/**
 * Валідація мови
 */
function validateLanguage(language) {
  if (!config.SUPPORTED_LANGUAGES.includes(language)) {
    return { isValid: false, error: 'Unsupported language' };
  }
  
  return { isValid: true, value: language };
}

module.exports = {
  validateSymbols,
  validateInterval,
  validateThreshold,
  validateCoinsCount,
  validateLanguage
};
