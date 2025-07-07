#!/bin/bash

# Скрипт для запуску Crypto Telegram Bot

echo "🚀 Запуск Crypto Telegram Bot..."

# Перевірка наявності .env файлу
if [ ! -f .env ]; then
    echo "❌ Файл .env не знайдено. Скопіюйте example.env в .env та налаштуйте токени."
    exit 1
fi

# Перевірка наявності node_modules
if [ ! -d node_modules ]; then
    echo "📦 Встановлення залежностей..."
    npm install
fi

# Зупинка попередніх процесів (якщо є)
echo "🛑 Зупинка попередніх процесів..."

# Перевірка PID файлів
if [ -f .bot.pid ] || [ -f .worker.pid ]; then
    echo "⚠️ Знайдено активні PID файли. Зупиняю процеси..."
    bash stop.sh
    sleep 3
fi

# Додаткова перевірка активних процесів
if command -v pgrep &> /dev/null; then
    # Linux/Mac
    RUNNING_BOTS=$(pgrep -f "node src/bot.js" | wc -l)
    RUNNING_WORKERS=$(pgrep -f "node src/worker.js" | wc -l)
elif command -v tasklist &> /dev/null; then
    # Windows
    RUNNING_BOTS=$(tasklist | grep -c "node.exe" || echo "0")
    RUNNING_WORKERS=0  # Не можемо точно визначити worker на Windows
else
    # Fallback
    RUNNING_BOTS=0
    RUNNING_WORKERS=0
fi

if [ $RUNNING_BOTS -gt 0 ] || [ $RUNNING_WORKERS -gt 0 ]; then
    echo "⚠️ Знайдено запущені процеси бота ($RUNNING_BOTS processes)"
    echo "🛑 Примусова зупинка..."
    
    if command -v pkill &> /dev/null; then
        pkill -f "node src/bot.js" 2>/dev/null || true
        pkill -f "node src/worker.js" 2>/dev/null || true
    elif command -v taskkill &> /dev/null; then
        taskkill /f /im node.exe 2>/dev/null || true
    fi
    
    sleep 3
fi

echo "✅ Система очищена, продовжую запуск..."

# Очікування зупинки процесів
sleep 2

# Запуск бота
echo "🤖 Запуск основного бота..."
node src/bot.js &
BOT_PID=$!

# Запуск worker
echo "⚙️ Запуск worker для моніторингу..."
node src/worker.js &
WORKER_PID=$!

echo "✅ Бот запущений успішно!"
echo "🤖 Bot PID: $BOT_PID"
echo "⚙️ Worker PID: $WORKER_PID"
echo ""
echo "📋 Для зупинки використовуйте: ./stop.sh"
echo "📊 Для перегляду логів: tail -f logs/combined.log"

# Збереження PID для зупинки
echo $BOT_PID > .bot.pid
echo $WORKER_PID > .worker.pid

# Очікування сигналу для зупинки
wait
