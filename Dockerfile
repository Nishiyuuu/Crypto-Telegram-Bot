FROM node:18-alpine

WORKDIR /app

# Копіюємо package.json та встановлюємо залежності
COPY package*.json ./
RUN npm ci --only=production

# Копіюємо код
COPY src/ ./src/
COPY translate.json ./

# Створюємо користувача без root привілеїв
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Змінюємо власника файлів
RUN chown -R nodejs:nodejs /app
USER nodejs

# Експонуємо порт (якщо потрібно)
EXPOSE 3000

# Запускаємо бот
CMD ["node", "src/bot.js"]
