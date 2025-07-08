# 🔑 API Налаштування для Crypto Telegram Bot

## 📋 Огляд API

**Поточна версія (1.2.0)** використовує мінімальний набір API для стабільної роботи основних функцій.

---

## ✅ АКТИВНО ВИКОРИСТОВУВАНІ API

### 1. 🤖 Telegram Bot API

**Статус**: ✅ Обов'язково  
**Вартість**: Безкоштовно  
**Функція**: Основний інтерфейс бота

#### Налаштування:
```env
# .env файл
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

#### Отримання токена:
1. Напишіть [@BotFather](https://t.me/BotFather) в Telegram
2. Створіть нового бота командою `/newbot`
3. Скопіюйте отриманий токен
4. Додайте до `.env` файлу

#### Детальний гайд:
- **[Створення бота](../telegram-setup.md)** - покрокова інструкція

### 2. 📈 Binance API

**Статус**: ✅ Активно використовується  
**Вартість**: Безкоштовно  
**Функція**: Джерело цін криптовалют

#### Особливості:
- Не потрібен API ключ для публічних даних
- Використовуються тільки публічні endpoint'и
- Ліміт: 1200 запитів/хвилину

#### Налаштування:
```javascript
// src/handlers/price.js
const Binance = require('binance-api-node').default;
const client = Binance(); // Без ключів для публічних даних
```

### 3. 🗄️ MongoDB Atlas

**Статус**: ✅ Обов'язково  
**Вартість**: Безкоштовно (M0 Sandbox)  
**Функція**: Зберігання даних користувачів

#### Налаштування:
```env
# .env файл
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crypto-bot
```

#### Підключення:
1. Зареєструйтесь на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Створіть безкоштовний cluster (M0)
3. Отримайте connection string
4. Додайте до `.env` файлу

---

## 🔄 ПЛАНУЄТЬСЯ ДОДАТИ

### 4. 🦎 CoinGecko API (v1.3)

**Статус**: 🔄 Планується  
**Вартість**: Безкоштовно / Pro ($129/міс)  
**Функція**: Альтернативне джерело цін

#### Переваги:
- Резервне джерело цін при недоступності Binance
- Додаткова інформація про монети
- Підтримка більшої кількості криптовалют

#### Майбутнє налаштування:
```env
# Буде додано в v1.3
COINGECKO_API_KEY=your_api_key (опціонально)
PRICE_API_PRIORITY=binance,coingecko
```

### 5. 💰 CoinMarketCap API (v1.4)

**Статус**: 🔄 Планується  
**Вартість**: Безкоштовно / Pro ($29/міс)  
**Функція**: Додаткові ринкові дані

#### Переваги:
- Ринкова капіталізація
- Об'єми торгівлі
- Рейтинги монет

---

## ⚙️ КОНФІГУРАЦІЯ ПОТОЧНОЇ ВЕРСІЇ

### Мінімальний .env файл:
```env
# Обов'язкові налаштування
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/crypto-bot

# Опціональні налаштування
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

### Повний .env файл:
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# База даних
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crypto-bot

# Середовище
NODE_ENV=production
PORT=3000

# Логування
LOG_LEVEL=info
LOG_FILE=./src/logs/combined.log

# Моніторинг
MONITOR_INTERVAL=15000
MESSAGE_DELAY=100

# Обмеження
RATE_LIMIT=true
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=30
```

---

## 🔧 НАЛАШТУВАННЯ РОЗРОБКИ

### Локальна розробка:
```env
# .env.local
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_dev_bot_token
MONGO_URI=mongodb://localhost:27017/crypto-bot-dev
LOG_LEVEL=debug
```

### Тестування:
```env
# .env.test
NODE_ENV=test
TELEGRAM_BOT_TOKEN=test_bot_token
MONGO_URI=mongodb://localhost:27017/crypto-bot-test
LOG_LEVEL=error
```

---

## 📊 ЛІМІТИ ТА ОБМЕЖЕННЯ

### Binance API:
- **Публічні endpoint'и**: 1200 запитів/хвилину
- **Без аутентифікації**: Тільки публічні дані
- **Rate limiting**: Автоматичне обмеження запитів

### MongoDB Atlas (M0):
- **Зберігання**: 512 MB
- **Підключення**: 100 одночасних
- **Трафік**: Необмежений

### Telegram Bot API:
- **Повідомлення**: 30 повідомлень/секунду
- **Груповий чат**: 20 повідомлень/хвилину
- **Файли**: До 50 MB

---

## 🚨 ВАЖЛИВІ ПРИМІТКИ

### Безпека:
- ❌ **НІКОЛИ** не коммітьте `.env` файли в Git
- ✅ Використовуйте `.env.example` як шаблон
- ✅ Регулярно змінюйте API ключі
- ✅ Використовуйте різні ключі для dev/prod

### Моніторинг:
- 📊 Відстежуйте використання API лімітів
- 📊 Моніторьте помилки API в логах
- 📊 Налаштуйте алерти на критичні помилки

### Backup:
- 💾 Регулярно робіть backup MongoDB
- 💾 Зберігайте копії `.env` файлів в безпечному місці
- 💾 Документуйте всі зміни в конфігурації

---

## 🆘 УСУНЕННЯ ПРОБЛЕМ

### Помилки Telegram Bot API:
```bash
# Перевірка токена
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# Помилка 409 - конфлікт webhook'ів
npm run reset-telegram
```

### Помилки Binance API:
```bash
# Перевірка доступності
curl https://api.binance.com/api/v3/ping

# Перевірка лімітів
curl https://api.binance.com/api/v3/exchangeInfo
```

### Помилки MongoDB:
```bash
# Перевірка підключення
mongosh "mongodb+srv://cluster.mongodb.net/" --username username

# Тестування в коді
npm run test:db
```

---

*Документація оновлена: 17.01.2025*  
*Версія API конфігурації: 1.2.0*  
*Статус: Синхронізовано з кодом ✅*
