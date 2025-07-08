# 🗄️ Налаштування MongoDB Atlas

## Крок 1: Створення кластера
1. Йдіть на https://cloud.mongodb.com
2. Зареєструйтеся або увійдіть
3. Створіть новий проект "Crypto-Bot"
4. Створіть безкоштовний кластер (M0 Sandbox)

## Крок 2: Налаштування доступу
1. **Database Access** → Add New Database User
   - Username: `cryptobot`
   - Password: `генеруйте_складний_пароль`
   - Роль: `Read and write to any database`

2. **Network Access** → Add IP Address
   - IP Address: `0.0.0.0/0` (для початку, пізніше обмежте)
   - Comment: "Crypto Bot Server"

## Крок 3: Отримання Connection String
1. **Clusters** → Connect → Connect your application
2. Driver: Node.js, Version: 4.1 or later
3. Скопіюйте connection string:
   ```
   mongodb+srv://cryptobot:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Крок 4: Тестування підключення
```bash
# На сервері:
npm install mongodb
node -e "
const { MongoClient } = require('mongodb');
const uri = 'ваш_connection_string';
MongoClient.connect(uri).then(() => {
  console.log('✅ MongoDB підключено успішно!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Помилка підключення:', err);
  process.exit(1);
});
"
```

## ✅ Результат
- ✅ Безкоштовний кластер MongoDB Atlas
- ✅ 512MB пам'яті (достатньо для старту)
- ✅ Автоматичні бекапи
- ✅ Моніторинг включений
