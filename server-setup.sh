#!/bin/bash
# 🚀 Швидке налаштування сервера для Crypto Telegram Bot

echo "🚀 Починаємо налаштування сервера..."

# Оновлення системи
sudo apt update && sudo apt upgrade -y

# Встановлення Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Встановлення PM2 для управління процесами
sudo npm install -g pm2

# Встановлення Git
sudo apt install -y git

# Створення користувача для бота (опціонально)
sudo useradd -m -s /bin/bash cryptobot || true

echo "✅ Сервер налаштовано! Node.js версія: $(node --version)"
echo "✅ NPM версія: $(npm --version)"
echo "✅ PM2 встановлено"
