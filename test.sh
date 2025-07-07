#!/bin/bash

echo "🧪 Тестування Crypto Telegram Bot..."

# Перевірка наявності необхідних файлів
echo "📁 Перевірка файлів..."
files=(
    "src/bot.js"
    "src/worker.js" 
    "src/translate.js"
    "translate.json"
    "package.json"
    ".env"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - існує"
    else
        echo "❌ $file - відсутній"
    fi
done

# Перевірка node_modules
if [ -d "node_modules" ]; then
    echo "✅ node_modules - встановлені"
else
    echo "❌ node_modules - відсутні. Запустіть: npm install"
fi

# Перевірка синтаксису JavaScript файлів
echo "🔍 Перевірка синтаксису..."
for jsfile in src/*.js src/handlers/*.js; do
    if node -c "$jsfile" 2>/dev/null; then
        echo "✅ $jsfile - синтаксис OK"
    else
        echo "❌ $jsfile - помилка синтаксису"
        node -c "$jsfile"
    fi
done

# Перевірка JSON файлів
echo "📋 Перевірка JSON файлів..."
if python -m json.tool translate.json > /dev/null 2>&1 || node -e "JSON.parse(require('fs').readFileSync('translate.json'))" 2>/dev/null; then
    echo "✅ translate.json - валідний JSON"
else
    echo "❌ translate.json - невалідний JSON"
fi

echo "🎉 Тестування завершено!"
