#!/bin/bash
# 🚀 ШВИДКИЙ ДЕПЛОЙ НА СЕРВЕР

set -e

echo "🚀 Починаємо розгортання Crypto Telegram Bot..."

# Перевірка змінних середовища
if [ -z "$BOT_TOKEN" ]; then
    echo "❌ Потрібно встановити BOT_TOKEN"
    echo "Виконайте: export BOT_TOKEN='ваш_токен_бота'"
    exit 1
fi

if [ -z "$MONGO_URI" ]; then
    echo "❌ Потрібно встановити MONGO_URI"
    echo "Виконайте: export MONGO_URI='mongodb+srv://...'"
    exit 1
fi

# 1. Клонування/оновлення коду
if [ ! -d "Crypto-Telegram-Bot" ]; then
    echo "📥 Клонування репозиторію..."
    git clone https://github.com/Nishiyuuu/Crypto-Telegram-Bot.git
else
    echo "🔄 Оновлення коду..."
    cd Crypto-Telegram-Bot
    git pull origin main
    cd ..
fi

cd Crypto-Telegram-Bot

# 2. Встановлення залежностей
echo "📦 Встановлення залежностей..."
npm ci --production

# 3. Створення .env файлу
echo "⚙️ Налаштування конфігурації..."
cat > .env << EOF
# Production конфігурація
BOT_TOKEN=$BOT_TOKEN
MONGO_URI=$MONGO_URI
NODE_ENV=production
LOG_LEVEL=info
COINGECKO_API_URL=https://api.coingecko.com/api/v3
NOTIFICATION_INTERVAL=30000
MAX_COINS_FREE=5
MAX_COINS_VIP=20
DEFAULT_THRESHOLD=5.0
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
SESSION_TIMEOUT=3600000
LOG_MAX_SIZE=5242880
LOG_MAX_FILES=5
LOG_DATE_PATTERN=YYYY-MM-DD
ENABLE_VIP_FEATURES=true
ENABLE_PRICE_ALERTS=true
EOF

# 4. Створення директорій
echo "📁 Створення директорій..."
mkdir -p logs

# 5. Тестування підключень
echo "🧪 Тестування підключень..."
timeout 10 node -e "
const config = require('./src/config/config.js');
console.log('✅ Конфігурація завантажена');
" || echo "⚠️ Попередження: тест конфігурації не пройшов"

# 6. Зупинка старих процесів
echo "🛑 Зупинка старих процесів..."
pm2 stop crypto-bot 2>/dev/null || true
pm2 delete crypto-bot 2>/dev/null || true

# 7. Запуск з PM2
echo "🚀 Запуск бота з PM2..."
pm2 start ecosystem.config.js --env production

# 8. Збереження PM2 конфігурації
pm2 save
pm2 startup | tail -1 | bash || true

# 9. Перевірка статусу
echo "📊 Статус запуску:"
sleep 3
pm2 status

echo "📝 Логи запуску:"
pm2 logs crypto-bot --lines 10

echo ""
echo "✅ Розгортання завершено!"
echo ""
echo "🔧 Корисні команди:"
echo "pm2 status           - статус всіх процесів"
echo "pm2 logs crypto-bot  - перегляд логів"
echo "pm2 restart crypto-bot - перезапуск бота"
echo "pm2 stop crypto-bot  - зупинка бота"
echo ""
