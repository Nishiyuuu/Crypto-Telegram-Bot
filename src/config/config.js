// Конфігурація для бота
module.exports = {
  // Обмеження для FREE користувачів
  FREE_LIMITS: {
    MAX_COINS: 2,
    MAX_INTERVAL: 600000, // 10 хвилин в мілісекундах
    MAX_THRESHOLD: 10 // 10%
  },
  
  // Обмеження для VIP користувачів
  VIP_LIMITS: {
    MAX_COINS: 5,
    MAX_INTERVAL: 60000, // 1 хвилина в мілісекундах
    MAX_THRESHOLD: 5 // 5%
  },
  
  // Налаштування моніторингу
  MONITORING: {
    CHECK_INTERVAL: 15000, // Перевіряти кожні 15 секунд
    MESSAGE_DELAY: 100 // Затримка між повідомленнями в мс
  },
  
  // Налаштування по замовчуванню
  DEFAULTS: {
    LANGUAGE: 'en',
    MONITOR_INTERVAL: 15000, // 15 секунд
    MONITOR_THRESHOLD: 0.5, // 0.5%
    USER_STATUS: 'free'
  },
  
  // Підтримувані мови
  SUPPORTED_LANGUAGES: ['uk', 'ru', 'be', 'en'],
  
  // Регулярні вирази для валідації
  VALIDATION: {
    SYMBOL_PATTERN: /^[A-Z]{2,10}USDT?$/,
    INTERVAL_MIN: 1,
    INTERVAL_MAX: 3600,
    THRESHOLD_MIN: 0.1,
    THRESHOLD_MAX: 50
  }
};
