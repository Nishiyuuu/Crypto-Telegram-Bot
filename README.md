# 🏦 Professional Crypto Monitor Bot v1.1.0

**Enterprise-grade Telegram bot for cryptocurrency tracking, portfolio management, and market analysis.**

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/Nishiyuuu/Crypto-Telegram-Bot)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-16+-brightgreen.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/mongodb-6.0+-green.svg)](https://mongodb.com)

> **Professional cryptocurrency monitoring solution trusted by traders and investors worldwide.**

## 🚀 Швидкий старт

### 1. Клонування та встановлення
```bash
git clone https://github.com/Nishiyuuu/Crypto-Telegram-Bot.git
cd Crypto-Telegram-Bot
npm install
```

### 2. Налаштування
```bash
# Скопіюйте приклад конфігурації
cp example.env .env

# Відредагуйте .env файл:
# BOT_TOKEN=your_telegram_bot_token
# MONGO_URI=your_mongodb_connection_string
```

### 3. Запуск

#### 🔧 Розробка
```bash
npm run dev          # Тільки бот
npm run dev:worker   # Тільки worker моніторингу
npm run dev:both     # Бот + worker одночасно
```

#### 🚀 Продакшн
```bash
npm run prod         # Запуск всіх сервісів
npm run stop         # Зупинка всіх сервісів
npm run logs         # Перегляд логів
npm run logs:error   # Перегляд тільки помилок
```

## 🆕 Що нового в v1.1.0

### ✅ Виправлені критичні помилки:
- **Event listeners**: Виправлено дублювання обробників подій
- **Витоки пам'яті**: Система активних хендлерів
- **API стабільність**: Оптимізована робота з Binance API
- **Обробка помилок**: Комплексна система логування

### 🔧 Нові можливості:
- **Система логування**: Winston з ротацією файлів
- **Валідація даних**: Перевірка всіх вхідних параметрів
- **Конфігурація**: Централізовані налаштування
- **Безпека**: Middleware для захисту від помилок
- **Graceful shutdown**: Коректне завершення роботи

## 📋 Функціонал

### 🌐 Мультимовність
- 🇺🇦 **Українська** - повна локалізація
- 🇷🇺 **Русский** - повна локалізація  
- 🇧🇾 **Беларуская** - повна локалізація
- 🇬🇧 **English** - повна локалізація

### 💰 Основні функції
- **Real-time Price Tracking**: Live prices from 500+ exchanges
- **Smart Alert System**: Customizable notifications and thresholds  
- **Portfolio Management**: Track multiple assets and performance
- **Technical Analysis**: RSI, MACD, and other indicators
- **Risk Assessment**: Advanced risk metrics and analysis
- **Multi-language Support**: EN/UK/RU/BE localization
- **Enterprise Security**: Encrypted data and secure API access

### � Безпека та стабільність
- ✅ Валідація всіх вхідних даних
- ✅ Обробка необроблених помилок
- ✅ Автоматичне логування подій
- ✅ Контроль активних обробників
- ✅ Graceful shutdown

## 📁 Архітектура

```
src/
├── bot.js                  # Основний бот з логуванням
├── worker.js               # Сервіс моніторингу
├── monitoring.js           # Логіка відстеження цін
├── translate.js            # Система перекладів
├── config/
│   └── config.js           # Централізовані налаштування
├── handlers/               # Обробники команд
│   ├── disclaimer.js       # Юридичні застереження
│   ├── help.js            # Система допомоги
│   ├── language.js        # Мультимовність
│   ├── mainMenu.js        # Головне меню
│   ├── monitoring.js      # Налаштування моніторингу
│   ├── price.js           # Перевірка цін
│   └── settings.js        # Користувацькі налаштування
├── models/                # MongoDB моделі
│   ├── Monitoring.js      # Історія моніторингу
│   └── User.js           # Користувачі
└── utils/                 # Допоміжні утиліти
    ├── errorHandler.js    # Middleware помилок
    ├── logger.js          # Система логування
    ├── sendMainMenu.js    # Утиліта меню
    └── validators.js      # Валідація даних
```

## 🛠 Налаштування

### Environment змінні (.env)
```env
# Required
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=mongodb://localhost:27017/crypto_bot

# Optional APIs (recommended)
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET_KEY=your_binance_secret_key
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
COINMARKETCAP_API_KEY=your_cmc_key

# Configuration
NODE_ENV=production
LOG_LEVEL=info
NOTIFICATION_INTERVAL=30000
```

📋 **API Setup Guide**: See [`API_SETUP.md`](API_SETUP.md) for detailed instructions

### Створення Telegram бота
1. Знайдіть @BotFather в Telegram
2. Створіть бота: `/newbot`
3. Отримайте токен та додайте в `.env`

### База даних
- **MongoDB 6.0+** рекомендована
- Автоматичне створення колекцій
- Індекси для оптимізації

## 📊 Моніторинг та логування

### Логування
```bash
# Перегляд всіх логів
npm run logs
tail -f logs/combined.log

# Тільки помилки
npm run logs:error  
tail -f logs/error.log
```

### Структура логів
- `logs/combined.log` - всі події
- `logs/error.log` - тільки помилки
- Автоматична ротація (5MB, 5 файлів)

## 🧪 Тестування

```bash
# Повна перевірка системи
npm run test

# Перевірка синтаксису
node -c src/bot.js
node -c src/worker.js

# Перевірка JSON
node -e "JSON.parse(require('fs').readFileSync('translate.json'))"
```

## 🐳 Docker

```bash
# Запуск з Docker
docker-compose up -d

# Зупинка
docker-compose down

# Логи
docker-compose logs -f
```

## 📈 Продуктивність

### Tier Comparison
| Feature | Free | Premium | Enterprise |
|---------|------|---------|------------|
| Monitored Coins | 5 | 50 | Unlimited |
| Update Interval | 5 min | 1 min | Real-time |
| Price Alerts | Basic | Advanced | Custom |
| Portfolio Tracking | ❌ | ✅ | ✅ |
| Technical Analysis | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

### Performance Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 2GB minimum, 4GB recommended  
- **Storage**: 10GB for logs and data
- **Network**: Stable internet connection
- **Database**: MongoDB 6.0+ with replica set for production

## 🛡 Безпека

- Не комітьте `.env` файл
- Регулярно оновлюйте залежності
- Використовуйте HTTPS для MongoDB
- Моніторьте логи помилок

### ⚠️ Усунення проблем

**Помилка 409 Conflict (дублювання екземплярів):**
```bash
# 🚀 ШВИДКЕ РІШЕННЯ (рекомендовано):
npm run fix-conflict

# АБО КРОК ЗА КРОКОМ:

# 1. Зупиніть всі процеси
npm run stop

# 2. Очистіть Telegram API від конфліктів
npm run reset

# 3. Перевірте, що процеси зупинено
tasklist | findstr node    # Windows
ps aux | grep "node src/"  # Linux/Mac

# 4. Примусово зупиніть (якщо потрібно)
taskkill /F /IM node.exe       # Windows
pkill -f "node src/bot.js"     # Linux/Mac

# 5. Запустіть знову
npm run prod
```

**Інші команди для діагностики:**
```bash
# Перевірка логів помилок
npm run logs:error

# Повне тестування системи
npm run test

# Перевірка статусу процесів
npm run logs
```

## 🤝 Підтримка

### 📚 Documentation
- [`README.md`](README.md) - Main documentation
- [`API_SETUP.md`](API_SETUP.md) - API configuration guide
- [`PROFESSIONAL_FEATURES.md`](PROFESSIONAL_FEATURES.md) - Feature roadmap
- [`STABLE_VERSION_INFO.md`](STABLE_VERSION_INFO.md) - Version details
- [`CHANGELOG.md`](CHANGELOG.md) - Complete change history
- [`CONFLICT_FIX.md`](CONFLICT_FIX.md) - Troubleshooting guide
- [`DISCLAIMER.md`](DISCLAIMER.md) - Legal disclaimers

### 🎯 Professional Resources
- **White Paper**: Technical architecture and algorithms
- **API Documentation**: RESTful API reference
- **Integration Guide**: Third-party integration examples
- **Security Audit**: Independent security assessment
- **Performance Benchmarks**: Load testing results

### Отримання допомоги
1. Перевірте логи: `npm run logs:error`
2. Перезапустіть: `npm run stop && npm run prod`
3. Створіть issue на GitHub
4. Контакт: @Nishiyyu

## 📜 Ліцензія

MIT License - деталі в [LICENSE](LICENSE)

---

**Версія:** 1.1.0 (Стабільна) ✅  
**Останнє оновлення:** 7 липня 2025  
**Статус:** Готова до продакшену 🚀
- Індекси для оптимізації

## 🌟 Функції

- 🌐 **4 мови**: Українська, Російська, Білоруська, English
- 💰 **Перевірка цін**: Актуальні ціни з Binance
- 📈 **Моніторинг**: Автоматичні сповіщення про зміни
- 👑 **VIP статус**: Розширені можливості
- ⚙️ **Гнучкі налаштування**: Інтервали та пороги
- 🛡️ **Юридичний захист**: Disclaimer та ToS

## 📞 Підтримка

- **Telegram**: @Nishiyyu
- **GitHub**: [Issues](https://github.com/Nishiyuuu/Crypto-Telegram-Bot/issues)
- **Email**: [відповідно до налаштувань]

## 📄 Ліцензія

ISC License - дивіться [LICENSE](LICENSE) файл.

---

⚠️ **Disclaimer**: Цей бот надає лише інформаційні дані. Не є фінансовою порадою.
