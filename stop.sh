#!/bin/bash

# Скрипт для зупинки Crypto Telegram Bot

echo "🛑 Зупинка Crypto Telegram Bot..."

# Функція для зупинки процесу
stop_process() {
    local pid=$1
    local name=$2
    
    if [ -n "$pid" ]; then
        echo "🔄 Зупинка $name (PID: $pid)..."
        kill $pid 2>/dev/null && echo "✅ $name зупинено" || echo "⚠️ $name вже зупинено"
    fi
}

# Зупинка по PID файлах
if [ -f .bot.pid ]; then
    BOT_PID=$(cat .bot.pid)
    stop_process $BOT_PID "бота"
    rm .bot.pid
fi

if [ -f .worker.pid ]; then
    WORKER_PID=$(cat .worker.pid)
    stop_process $WORKER_PID "worker"
    rm .worker.pid
fi

# Додаткова зупинка по імені процесу
echo "🔍 Пошук та зупинка всіх процесів бота..."

# Для Linux/Mac
if command -v pgrep &> /dev/null; then
    BOT_PIDS=$(pgrep -f "node src/bot.js")
    WORKER_PIDS=$(pgrep -f "node src/worker.js")
    
    for pid in $BOT_PIDS; do
        stop_process $pid "бота"
    done
    
    for pid in $WORKER_PIDS; do
        stop_process $pid "worker"
    done
fi

# Для Windows через taskkill
if command -v taskkill &> /dev/null; then
    taskkill /f /im node.exe 2>/dev/null && echo "✅ Всі Node.js процеси зупинено" || echo "⚠️ Процеси вже зупинено"
fi

# Очікування завершення
sleep 1

echo "✅ Всі процеси зупинено!"
