# 🔑 Повний гайд налаштування API для Crypto Telegram Bot

## 🎯 Огляд API провайдерів

### Категорії API:
- **🟢 Обов'язкові**: Необхідні для роботи бота
- **🟡 Рекомендовані**: Покращують функціональність  
- **🔴 Преміум**: Розширені можливості за плату

## 🟢 Обов'язкові API

### 1. Telegram Bot API
**Безкоштовно | Обов'язково**

#### Отримання токена:
1. Відкрийте Telegram та знайдіть @BotFather
2. Створіть бота:
   ```
   /start
   /newbot
   My Crypto Monitor Bot
   mycryptomonitor_bot
   ```
3. Збережіть токен у форматі: `1234567890:AAA-BBB-CCC`

#### Налаштування в .env:
```env
BOT_TOKEN=1234567890:AAA-BBB-CCC-DDD-EEE
```

#### Додаткові налаштування:
```env
# Вебхук (для продакшну)
WEBHOOK_URL=https://yourdomain.com/webhook
WEBHOOK_SECRET=your_webhook_secret

# Ліміти
MAX_CONNECTIONS=100
ALLOWED_UPDATES=["message","callback_query"]
```

### 2. MongoDB Database
**Безкоштовно 500MB | Обов'язково**

#### MongoDB Atlas (рекомендовано):
1. Зареєструйтесь на [mongodb.com/atlas](https://mongodb.com/atlas)
2. Створіть організацію та проект
3. Створіть кластер (виберіть M0 Sandbox - безкоштовно)
4. Створіть користувача бази даних
5. Додайте IP адресу (0.0.0.0/0 для початку)
6. Отримайте connection string

#### Налаштування в .env:
```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/crypto_bot

# Або локальний MongoDB
MONGO_URI=mongodb://localhost:27017/crypto_bot

# Додаткові параметри
MONGO_OPTIONS=retryWrites=true&w=majority
MONGO_TIMEOUT=5000
MONGO_MAX_POOL_SIZE=10
```

## 🟡 Рекомендовані API (Безкоштовні)

### 3. Binance API
**Безкоштовно | Рекомендовано**

#### Отримання ключів:
1. Зареєструйтесь на [binance.com](https://binance.com)
2. Перейдіть в API Management
3. Створіть новий API ключ
4. Налаштуйте дозволи (тільки "Enable Reading")
5. Збережіть API Key та Secret Key

#### Налаштування в .env:
```env
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET_KEY=your_binance_secret_key
BINANCE_BASE_URL=https://api.binance.com
BINANCE_TESTNET=false

# Ліміти запитів
BINANCE_WEIGHT_LIMIT=1200
BINANCE_REQUEST_LIMIT=100
```

### 4. CoinGecko API  
**Безкоштовно 50 req/хв | Рекомендовано**

#### Базове налаштування:
```env
# Публічний API (без реєстрації)
COINGECKO_API_URL=https://api.coingecko.com/api/v3
COINGECKO_TIMEOUT=5000

# Ліміти
COINGECKO_RATE_LIMIT=50
COINGECKO_RATE_WINDOW=60000
```

#### Отримання Pro ключа (💎 $99/міс):
1. Зареєструйтесь на [coingecko.com](https://coingecko.com/api)
2. Виберіть план Developer або Analyst
3. Отримайте API ключ

```env
# CoinGecko Pro
COINGECKO_API_KEY=CG-xxxxxxxxxxxxxxxx
COINGECKO_PRO_URL=https://pro-api.coingecko.com/api/v3
COINGECKO_RATE_LIMIT=500
```

### 5. CryptoCompare API
**Безкоштовно 100k req/міс | Рекомендовано**

#### Отримання ключа:
1. Зареєструйтесь на [cryptocompare.com](https://cryptocompare.com/api)
2. Підтвердіть email
3. Створіть API ключ в Dashboard

#### Налаштування в .env:
```env
CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key
CRYPTOCOMPARE_BASE_URL=https://min-api.cryptocompare.com
CRYPTOCOMPARE_TIMEOUT=5000

# Ліміти безкоштовного плану
CRYPTOCOMPARE_HOURLY_LIMIT=100000
CRYPTOCOMPARE_MONTHLY_LIMIT=100000
```

## 🔴 Преміум API

### 6. CoinMarketCap API
**💎 Від $39/міс | Преміум**

#### Отримання ключа:
1. Зареєструйтесь на [coinmarketcap.com/api](https://coinmarketcap.com/api)
2. Виберіть план (Basic $39, Standard $99, Professional $299)
3. Отримайте API ключ

#### Налаштування в .env:
```env
COINMARKETCAP_API_KEY=your_cmc_api_key
COINMARKETCAP_BASE_URL=https://pro-api.coinmarketcap.com
COINMARKETCAP_SANDBOX=false

# Ліміти за планами
COINMARKETCAP_MONTHLY_LIMIT=10000  # Basic
# COINMARKETCAP_MONTHLY_LIMIT=30000  # Standard
# COINMARKETCAP_MONTHLY_LIMIT=100000 # Professional
```

### 7. Whale Alert API
**💎 Від $39/міс | VIP функція**

#### Отримання ключа:
1. Зареєструйтесь на [whale-alert.io](https://whale-alert.io)
2. Виберіте план (Basic $39, Pro $99, Premium $299)
3. Отримайте API ключ

#### Налаштування в .env:
```env
WHALE_ALERT_API_KEY=your_whale_alert_key
WHALE_ALERT_BASE_URL=https://api.whale-alert.io
WHALE_ALERT_TIMEOUT=10000

# Мінімальна сума для сповіщень (USD)
WHALE_ALERT_MIN_VALUE=1000000

# Підтримувані блокчейни
WHALE_ALERT_BLOCKCHAINS=bitcoin,ethereum,tron,bsc,polygon
```

### 8. Messari API
**💎 Від $25/міс | Аналітика**

#### Отримання ключа:
1. Зареєструйтесь на [messari.io](https://messari.io/api)
2. Виберіть план (Pro $25, Enterprise $125)
3. Отримайте API ключ

#### Налаштування в .env:
```env
MESSARI_API_KEY=your_messari_api_key
MESSARI_BASE_URL=https://data.messari.io/api
MESSARI_TIMEOUT=5000

# Ліміти
MESSARI_RATE_LIMIT=20  # Pro plan
# MESSARI_RATE_LIMIT=100  # Enterprise
```

### 9. TradingView API
**💎 Від $500/міс | Enterprise**

#### Для інституційних клієнтів:
```env
TRADINGVIEW_API_KEY=your_tradingview_key
TRADINGVIEW_BASE_URL=https://scanner.tradingview.com
TRADINGVIEW_SYMBOL_INFO_URL=https://symbol-search.tradingview.com

# Розширені індикатори
TRADINGVIEW_INDICATORS=RSI,MACD,BB,SMA,EMA
```

## 🛠 Конфігурація за планами

### Мінімальна конфігурація (Безкоштовно):
```env
# Обов'язкові
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=your_mongodb_atlas_uri

# Базові дані
COINGECKO_API_URL=https://api.coingecko.com/api/v3
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET_KEY=your_binance_secret_key
```

### Професійна конфігурація ($50-100/міс):
```env
# Додайте до мінімальної
COINGECKO_API_KEY=your_coingecko_pro_key
COINMARKETCAP_API_KEY=your_cmc_key
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
WHALE_ALERT_API_KEY=your_whale_alert_key
MESSARI_API_KEY=your_messari_key
```

### Enterprise конфігурація ($500+/міс):
```env
# Додайте до професійної
TRADINGVIEW_API_KEY=your_tradingview_key
DEFIPULSE_API_KEY=your_defipulse_key

# Підвищені ліміти
COINGECKO_RATE_LIMIT=1000
COINMARKETCAP_MONTHLY_LIMIT=100000
WHALE_ALERT_PREMIUM=true
```

## 📊 Моніторинг API

### Відстеження лімітів:
```env
# Логування API викликів
API_LOGGING=true
API_LOG_LEVEL=info

# Попередження про ліміти
API_LIMIT_WARNING=80  # % від ліміту
API_LIMIT_ALERT=95

# Кешування для економії запитів
CACHE_ENABLED=true
CACHE_TTL=300  # 5 хвилин
```

### Health Check API:
```bash
# Перевірка всіх API
npm run test:api

# Перевірка конкретного API
npm run test:api:binance
npm run test:api:coingecko
npm run test:api:coinmarketcap
```

## 🔒 Безпека API

### Захист ключів:
```env
# Ніколи не комітьте .env файл!
# Використовуйте .env.example як шаблон

# Ротація ключів (рекомендовано щомісяця)
API_KEY_ROTATION_DAYS=30

# IP whitelist (якщо підтримується)
API_ALLOWED_IPS=your.server.ip.address
```

### Обмеження доступу:
```env
# Дозволи для API ключів (тільки читання!)
BINANCE_PERMISSIONS=["spot:read"]
COINMARKETCAP_PERMISSIONS=["read"]

# Таймаути
API_TIMEOUT=5000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
```

## 📈 Оптимізація витрат

### Стратегії економії:
1. **Кешування**: Зберігайте дані на 5-15 хвилин
2. **Батчінг**: Запитуйте декілька монет за раз
3. **Приоритизація**: Використовуйте безкоштовні API першими
4. **Fallback**: Налаштуйте резервні API

### Налаштування пріоритетів:
```env
# Порядок використання API для цін
PRICE_API_PRIORITY=binance,coingecko,cryptocompare,coinmarketcap

# Fallback для недоступних API
PRICE_API_FALLBACK=true
PRICE_API_TIMEOUT=3000
```

## ⚠️ Усунення проблем API

### Частіз помилки та рішення:

**401 Unauthorized:**
- Перевірте правильність API ключів
- Переконайтесь, що ключ активний
- Перевірте дозволи ключа

**403 Forbidden:**
- Перевірте IP whitelist
- Переконайтесь в дозволах
- Можливо досягнуто ліміт

**429 Too Many Requests:**
- Зменшіть частоту запитів
- Налаштуйте кешування
- Перевірте rate limits

**Команди діагностики:**
```bash
# Перевірка підключення
curl -X GET "https://api.binance.com/api/v3/time"

# Тест API ключа
npm run test:api:auth

# Перевірка лімітів
npm run api:limits
```

## 📚 Додаткові ресурси

### Документація API:
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Binance API](https://binance-docs.github.io/apidocs/)
- [CoinGecko API](https://coingecko.com/api/documentation)
- [CoinMarketCap API](https://coinmarketcap.com/api/documentation)
- [CryptoCompare API](https://cryptocompare.com/api)

### Інструменти тестування:
- [Postman колекції](https://postman.com)
- [Insomnia REST client](https://insomnia.rest)
- [curl командний рядок](https://curl.se)

---

✅ **Після налаштування API переходьте до [РОЗГОРТАННЯ.md](РОЗГОРТАННЯ.md)**
