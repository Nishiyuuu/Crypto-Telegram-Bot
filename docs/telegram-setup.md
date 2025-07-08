# 🤖 Telegram Bot API Setup

## Крок 1: Створення бота

1. **Відкрийте Telegram** на телефоні або комп'ютері
2. **Знайдіть @BotFather** - офіційний бот для створення ботів
3. **Напишіть команду:** `/start`
4. **Створіть нового бота:** `/newbot`
5. **Введіть назву бота** (наприклад: "My Crypto Monitor Bot")
6. **Введіть username бота** (має закінчуватися на "bot", наприклад: "mycryptomonitor_bot")

## Крок 2: Отримання токена

Після створення бота ви отримаєте повідомлення:
```
Congratulations! You have just created a new bot.
Token: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

## Крок 3: Додавання в .env

```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

## ⚙️ Додаткові налаштування бота

1. **Опис бота:** `/setdescription`
2. **Команди меню:** `/setcommands`
3. **Аватар бота:** `/setuserpic`

### Рекомендовані команди:
```
start - Запустити бота
help - Допомога
price - Перевірити ціну
monitoring - Налаштувати моніторинг
settings - Налаштування
```
