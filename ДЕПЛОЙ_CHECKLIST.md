# ✅ CHECKLIST ДЕПЛОЮ

## Перед деплоем:

### 🎯 Обов'язкові кроки:
- [ ] **Сервер готовий** (Ubuntu 18.04+ / Debian 10+ / CentOS 7+)
- [ ] **Node.js 18+** встановлено
- [ ] **PM2** встановлено глобально
- [ ] **Git** встановлено
- [ ] **Telegram Bot створено** (@BotFather)
- [ ] **MongoDB Atlas** налаштовано
- [ ] **Firewall** налаштовано (порти 80, 443 відкриті)

### 🔑 Необхідні дані:
- [ ] **BOT_TOKEN** - токен від @BotFather
- [ ] **MONGO_URI** - connection string від MongoDB Atlas
- [ ] **Server IP** - IP адреса вашого сервера

---

## Швидкий деплой (10 хвилин):

### 1️⃣ Налаштування сервера (2 хв)
```bash
# На сервері:
curl -fsSL https://raw.githubusercontent.com/Nishiyuuu/Crypto-Telegram-Bot/main/server-setup.sh | bash
```

### 2️⃣ Telegram Bot (3 хв)
- Напишіть @BotFather
- `/newbot`
- Назва: `My Crypto Monitor Bot`
- Username: `mycrypto_monitor_bot`
- Збережіть токен!

### 3️⃣ MongoDB Atlas (3 хв)  
- https://cloud.mongodb.com
- Створіть безкоштовний кластер
- Додайте користувача та IP `0.0.0.0/0`
- Збережіть connection string!

### 4️⃣ Деплой (2 хв)
```bash
# На сервері:
export BOT_TOKEN="ваш_токен"
export MONGO_URI="ваш_mongodb_uri"

curl -fsSL https://raw.githubusercontent.com/Nishiyuuu/Crypto-Telegram-Bot/main/quick-deploy.sh | bash
```

---

## Перевірка роботи:

### ✅ Команди для перевірки:
```bash
# Статус PM2
pm2 status

# Логи бота (останні 20 рядків)
pm2 logs crypto-bot --lines 20

# Моніторинг в реальному часі
pm2 monit
```

### ✅ Тестування в Telegram:
1. Знайдіть свого бота в Telegram
2. Надішліть `/start`
3. Виберіть мову
4. Спробуйте `/price BTC`
5. Налаштуйте моніторинг

---

## Управління ботом:

### 🔧 Основні команди:
```bash
pm2 restart crypto-bot     # Перезапуск
pm2 stop crypto-bot        # Зупинка  
pm2 logs crypto-bot        # Логи
pm2 flush crypto-bot       # Очистити логи
```

### 🔄 Оновлення бота:
```bash
cd Crypto-Telegram-Bot
git pull origin main
npm install
pm2 restart crypto-bot
```

---

## 🆘 Швидка діагностика:

### Якщо бот не відповідає:
```bash
pm2 status                 # Перевірте статус
pm2 logs crypto-bot        # Перевірте логи
pm2 restart crypto-bot     # Перезапустіть
```

### Якщо помилки в логах:
```bash
# Перевірте конфігурацію
cat .env

# Перевірте підключення до MongoDB
node -e "
const { MongoClient } = require('mongodb');
MongoClient.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB OK'))
  .catch(err => console.error('❌ MongoDB Error:', err));
"
```

---

## 🎉 Готово!

Ваш **Crypto Telegram Bot** працює на сервері 24/7!

**Знайдіть його в Telegram і надішліть `/start`** 🚀

---

*Цей checklist створено для версії 1.0.3 (синхронізованої)*
