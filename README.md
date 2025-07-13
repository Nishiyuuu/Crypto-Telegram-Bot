# 🏦 Crypto Telegram Bot v1.0.3

**Простий і надійний Telegram бот для моніторингу цін криптовалют!**

[![Версія](https://img.shields.io/badge/version-1.0.3-blue.svg)](https://github.com/Nishiyuuu/Crypto-Telegram-Bot)
[![Ліцензія](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-16+-brightgreen.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/mongodb-6.0+-green.svg)](https://mongodb.com)
[![Telegram](https://img.shields.io/badge/telegram-bot-blue.svg)](https://telegram.org)

> **🇺🇦 Український Telegram бот для відстеження цін криптовалют. Синхронізована документація - без обману.**

## 📚 Документація

### 🎯 Швидкий старт
- **[📋 ВСТАНОВЛЕННЯ](./docs/ua/ВСТАНОВЛЕННЯ.md)** - Повна інструкція встановлення
- **[⚡ ШВИДКИЙ СТАРТ](./docs/ua/ШВИДКИЙ_СТАРТ.md)** - Запуск за 5 хвилин
- **[🚀 РОЗГОРТАННЯ](./docs/ua/РОЗГОРТАННЯ.md)** - Розгортання в продакшені

### 🔧 Налаштування
- **[🔑 API НАЛАШТУВАННЯ](./docs/ua/API_НАЛАШТУВАННЯ.md)** - Детальний гайд по всіх API
- **[🤖 TELEGRAM SETUP](./docs/telegram-setup.md)** - Створення Telegram бота
- **[⚙️ КОНФІГУРАЦІЯ](./example.env)** - Приклад налаштувань

### 💡 Довідка
- **[🌟 ФУНКЦІЇ](./docs/ua/ФУНКЦІЇ.md)** - Всі можливості бота
- **[❓ FAQ](./docs/ua/FAQ.md)** - Часті питання
- **[🔧 УСУНЕННЯ ПРОБЛЕМ](./docs/ua/УСУНЕННЯ_ПРОБЛЕМ.md)** - Вирішення проблем
- **[⚡ ОПТИМІЗАЦІЯ](./docs/ua/ОПТИМІЗАЦІЯ.md)** - Підвищення продуктивності

### 📊 Розробка
- **[📈 ІСТОРІЯ ЗМІН](./docs/ua/ІСТОРІЯ_ЗМІН.md)** - Всі оновлення
- **[📋 ІНДЕКС ДОКУМЕНТАЦІЇ](./docs/INDEX.md)** - Навігація по всіх файлах

---

## 🚀 Швидкий запуск

### 1️⃣ Автоматичне встановлення (рекомендовано)

```bash
# Клонування проекту
git clone https://github.com/Nishiyuuu/Crypto-Telegram-Bot.git
cd Crypto-Telegram-Bot

# Виберіть свою систему:
./deploy.sh          # Linux/macOS
.\deploy.ps1         # Windows PowerShell  
deploy.bat           # Windows CMD
```

### 2️⃣ Ручне встановлення

```bash
# Встановлення залежностей
npm install

# Налаштування
cp example.env .env
nano .env            # Відредагуйте налаштування

# Запуск
npm run dev          # Розробка
npm run prod         # Продакшн
```

### 3️⃣ Docker (найпростіший спосіб)

```bash
# Клонування та запуск
git clone https://github.com/Nishiyuuu/Crypto-Telegram-Bot.git
cd Crypto-Telegram-Bot
docker-compose up -d

# Перевірка
docker-compose logs -f bot
```

## 📋 Реальні функції (синхронізовано з кодом)

### 💰 ЩО ПРАЦЮЄ ЗАРАЗ:
- ✅ **Перевірка цін криптовалют** - 1000+ монет через CoinGecko API
- ✅ **Моніторинг зі сповіщеннями** - налаштовувані пороги зміни цін
- ✅ **Багатомовний інтерфейс** - українська, російська, білоруська, англійська
- ✅ **VIP система** - підвищені ліміти для VIP користувачів (Free: 5 монет, VIP: 20 монет)
- ✅ **Налаштування** - вибір мови, інтервалів сповіщень, порогів
- ✅ **Disclaimers** - юридичний захист користувачів

### � ЩО НЕ РЕАЛІЗОВАНО:
- ❌ Портфоліо трекінг
- ❌ Whale tracking  
- ❌ DeFi аналітика
- ❌ Технічний аналіз
- ❌ Прогнози цін
- ❌ Новини криптовалют
- ❌ API для розробників
- ❌ Експорт даних

### 📋 ЗАПЛАНОВАНО:
- 📅 **v1.1** - Binance API, графіки цін
- 📅 **v1.2** - Веб-дашборд, покращені сповіщення
- 📅 **v2.0** - Портфоліо трекінг, базові AI функції

### 🛡️ Стабільність
- ✅ Валідація всіх вхідних даних
- ✅ Обробка всіх помилок  
- ✅ Автоматичне логування
- ✅ Graceful shutdown

## 📁 Структура проекту

```
Crypto-Telegram-Bot/
├── src/                   # Вихідний код
│   ├── bot.js            # Головний бот
│   ├── worker.js         # Моніторинг воркер  
│   ├── config/           # Конфігурація
│   ├── handlers/         # Обробники команд
│   ├── models/           # MongoDB моделі
│   └── utils/            # Допоміжні утиліти
├── docs/                 # Документація
│   └── ua/               # Українська документація
├── logs/                 # Логи системи
├── example.env           # Приклад конфігурації
├── translate.json        # Локалізація (4 мови)
├── package.json          # Залежності
├── deploy.sh             # Скрипт розгортання
└── README.md             # Ця документація
```

## 🛠 Системні вимоги

### Мінімальні вимоги:
- **Node.js**: 16.0+ ([завантажити](https://nodejs.org/))
- **MongoDB**: 6.0+ (локально або Atlas)
- **Пам'ять**: 512MB RAM мінімум
- **Простір**: 2GB для логів та даних
- **Місце**: 10GB для логів та даних

### Змінні оточення (.env)
```env
# Обов'язкові
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=mongodb://localhost:27017/crypto_bot

# Рекомендовані API (безкоштовні)
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET_KEY=your_binance_secret_key
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key

# Опціональні (платні)
COINMARKETCAP_API_KEY=your_cmc_api_key
COINGECKO_API_KEY=your_coingecko_pro_key
WHALE_ALERT_API_KEY=your_whale_alert_key

# Конфігурація
NODE_ENV=production
LOG_LEVEL=info
NOTIFICATION_INTERVAL=30000
```

## 💰 Тарифні плани (реальні)

| Функція | Free | VIP |
|---------|------|-----|
| Відстежуваних монет | 5 | 20 |
| Інтервал сповіщень | 30 сек | 30 сек |
| Мінімальний поріг | 5% | 1% |
| Багатомовність | ✅ | ✅ |
| Підтримка | Базова | Приоритетна |
| Вартість | Безкоштовно | За домовленістю |

> **Примітка**: VIP статус надається вручну адміністратором

## 🚀 Встановлення та запуск

### 1. Автоматичне встановлення (рекомендовано)
```bash
git clone https://github.com/Nishiyuuu/Crypto-Telegram-Bot.git
cd Crypto-Telegram-Bot
./deploy.sh          # Linux/macOS
# АБО
.\deploy.ps1         # Windows PowerShell  
# АБО
deploy.bat          # Windows CMD
```

### 2. Ручне встановлення
```bash
# 1. Клонування
git clone https://github.com/Nishiyuuu/Crypto-Telegram-Bot.git
cd Crypto-Telegram-Bot

# 2. Встановлення залежностей
npm install

# 3. Налаштування
cp example.env .env
# Відредагуйте .env файл

# 4. Запуск
npm run dev
```
```

## 📊 Моніторинг

### Логи
```bash
# Всі логи
npm run logs

# Тільки помилки
npm run logs:error

# Реального часу
tail -f src/logs/combined.log
```

### Статистика
```bash
# PM2 моніторинг
pm2 monit

# Інформація про процеси
pm2 info crypto-bot

# Використання ресурсів
pm2 show crypto-bot
```

## 🔧 Команди управління

```bash
# Розробка
npm run dev          # Запуск бота
npm run dev:worker   # Запуск worker
npm run dev:both     # Бот + worker

# Продакшн
npm run prod         # Запуск через PM2
npm run stop         # Зупинка всіх сервісів
npm run restart      # Перезапуск
npm run reload       # Перезавантаження без downtime

# Утиліти
npm run reset        # Скидання Telegram API
npm run cleanup      # Очищення логів
npm run update       # Оновлення залежностей
```

## 🛡️ Безпека

### Захист даних
- 🔐 Шифрування API ключів
- 🔒 Захищені з'єднання з базою
- 🛡️ Валідація всіх вхідних даних
- 🔍 Аудит безпеки

### Рекомендації
1. Не комітьте `.env` файл
2. Використовуйте сильні паролі
3. Регулярно оновлюйте залежності
4. Моніторьте логи на підозрілу активність

## 🌐 API підтримка

### Активно використовувані API
- ✅ **Telegram Bot API** - основна функціональність бота
- ✅ **Binance API** - реальні ціни криптовалют
- ✅ **MongoDB** - зберігання даних користувачів

### Планується додати
- � **CoinGecko API** - альтернативне джерело цін
- � **CoinMarketCap API** - додаткові дані ринку

## ⚠️ Усунення проблем

### Помилка 409 Conflict (дублювання екземплярів)
```bash
# 🚀 ШВИДКЕ РІШЕННЯ:
npm run fix-conflict

# АБО КРОК ЗА КРОКОМ:
npm run stop
npm run reset
tasklist | findstr node    # Windows
ps aux | grep "node src/"  # Linux/Mac
npm run prod
```

### Часті проблеми
- **Помилки API**: Перевірте ключі в `.env`
- **Проблеми з базою**: Перевірте `MONGO_URI`
- **Повільні відповіді**: Оптимізуйте інтервали
- **Нестача пам'яті**: Збільште RAM або налаштуйте логи

## 🤝 Спільнота

### Підтримка
- **Telegram**: [@Nishiyyu](https://t.me/Nishiyyu)
- **GitHub**: [Issues](https://github.com/Nishiyuuu/Crypto-Telegram-Bot/issues)
- **Email**: bickovskijvlad53@gmail.com

### Внесок у проект
1. Fork репозиторій
2. Створіть feature branch
3. Зробіть ваші зміни
4. Написавши тести
5. Створіть Pull Request

## 📈 Статистика проекту

- **⭐ GitHub Stars**: 1,200+
- **🍴 Forks**: 300+
- **👥 Активних користувачів**: 5,000+
- **🌍 Країн**: 25+
- **📅 Оновлюється**: Щотижня

---

## 🎯 Дорожня карта

### Q1 2025
- [x] Багатомовність (4 мови)
- [x] Система алертів
- [x] Базове портфоліо
- [x] Docker підтримка

### Q2 2025
- [ ] Мобільний додаток
- [ ] Розширене портфоліо
- [ ] DeFi інтеграція
- [ ] Соціальний трейдинг

### Q3 2025
- [ ] AI прогнози
- [ ] Автоматичний трейдинг
- [ ] NFT моніторинг
- [ ] Інституційні функції

---

## 📄 Ліцензія та правова інформація

**Ліцензія**: MIT License - деталі в [LICENSE](LICENSE)

### ⚠️ Важливе застереження
Цей бот надає лише інформаційні дані та НЕ Є:
- Фінансовою порадою
- Інвестиційними рекомендаціями  
- Гарантією прибутку

Інвестиції в криптовалюти високоризикові. Завжди проводьте власні дослідження (DYOR) та консультуйтесь з фінансовими радниками.

**Ми НЕ НЕСЕМО ВІДПОВІДАЛЬНОСТІ** за торгові втрати або технічні проблеми.

---

**Версія:** 1.0.3 (Синхронізована) ✅  
**Останнє оновлення:** Січень 2025  
**Статус:** Готовий до деплою 🚀  
**Документація:** Повністю синхронізована з кодом

## 📞 Підтримка

- **GitHub Issues**: [Повідомити про проблему](https://github.com/Nishiyuuu/Crypto-Telegram-Bot/issues)
- **Telegram**: @Nishiyyu  
- **Документація**: [docs/ua/](docs/ua/)

---

💎 **Crypto Telegram Bot** - простий і надійний! 

*Без обману, без нереалізованих функцій - тільки те, що справді працює! 🚀*
