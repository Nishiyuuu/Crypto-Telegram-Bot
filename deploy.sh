#!/bin/bash
# 🚀 Автоматичне розгортання Crypto Telegram Bot

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Логування
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Перевірка системи
check_system() {
    log "Перевіряємо системні вимоги..."
    
    # Перевірка Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js не встановлено. Встановіть Node.js 18+ LTS"
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Потрібна версія Node.js 18+. Поточна версія: $(node --version)"
    fi
    
    # Перевірка npm
    if ! command -v npm &> /dev/null; then
        error "npm не встановлено"
    fi
    
    # Перевірка MongoDB
    if ! command -v mongod &> /dev/null; then
        warn "MongoDB не встановлено локально. Переконайтеся, що MongoDB Atlas налаштовано"
    fi
    
    # Перевірка PM2
    if ! command -v pm2 &> /dev/null; then
        log "Встановлюємо PM2..."
        npm install -g pm2
    fi
    
    log "✅ Системні вимоги виконані"
}

# Встановлення залежностей
install_dependencies() {
    log "Встановлюємо залежності..."
    
    if [ -f "package-lock.json" ]; then
        npm ci --only=production
    else
        npm install --only=production
    fi
    
    log "✅ Залежності встановлено"
}

# Конфігурація
setup_config() {
    log "Налаштовуємо конфігурацію..."
    
    # Перевірка .env файлу
    if [ ! -f ".env" ]; then
        if [ -f "example.env" ]; then
            cp example.env .env
            warn "Створено .env файл з example.env. Будь ласка, налаштуйте змінні оточення"
            echo "Редагуйте .env файл:"
            echo "nano .env"
            echo ""
            echo "Обов'язкові параметри:"
            echo "- BOT_TOKEN=your_telegram_bot_token"
            echo "- MONGO_URI=your_mongodb_connection_string"
            echo ""
            read -p "Натисніть Enter після налаштування .env файлу..."
        else
            error ".env файл не знайдено та example.env відсутній"
        fi
    fi
    
    # Перевірка обов'язкових параметрів
    if ! grep -q "BOT_TOKEN=" .env || ! grep -q "MONGO_URI=" .env; then
        error "Обов'язкові параметри BOT_TOKEN та MONGO_URI не налаштовані в .env"
    fi
    
    # Створення папок
    mkdir -p src/logs
    mkdir -p backup
    
    # Встановлення прав
    chmod 600 .env
    
    log "✅ Конфігурацію налаштовано"
}

# Тестування
run_tests() {
    log "Запускаємо тести..."
    
    # Перевірка синтаксису
    if [ -f "package.json" ]; then
        npm run test 2>/dev/null || warn "Тести не пройдені або не налаштовані"
    fi
    
    # Перевірка JSON файлів
    if [ -f "translate.json" ]; then
        node -e "JSON.parse(require('fs').readFileSync('translate.json', 'utf8'))" || error "translate.json містить помилки"
    fi
    
    log "✅ Тести завершено"
}

# Запуск в продакшні
deploy_production() {
    log "Розгортаємо в продакшні..."
    
    # Зупинка існуючих процесів
    pm2 stop crypto-bot 2>/dev/null || true
    pm2 stop crypto-worker 2>/dev/null || true
    pm2 delete crypto-bot 2>/dev/null || true
    pm2 delete crypto-worker 2>/dev/null || true
    
    # Запуск з PM2
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
    else
        pm2 start src/bot.js --name crypto-bot
        pm2 start src/worker.js --name crypto-worker
    fi
    
    # Збереження конфігурації PM2
    pm2 save
    
    # Налаштування автозапуску
    pm2 startup systemd -u $(whoami) --hp $(pwd) || warn "Не вдалося налаштувати автозапуск"
    
    log "✅ Розгортання завершено"
}

# Налаштування моніторингу
setup_monitoring() {
    log "Налаштовуємо моніторинг..."
    
    # Встановлення PM2 плагінів
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 30
    pm2 set pm2-logrotate:compress true
    
    # Створення скрипта health check
    cat > scripts/health-check.js << 'EOF'
const axios = require('axios');
const fs = require('fs');

async function healthCheck() {
    const results = [];
    
    // Перевірка Telegram API
    try {
        const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getMe`);
        results.push({ service: 'Telegram', status: 'OK', latency: response.duration });
    } catch (error) {
        results.push({ service: 'Telegram', status: 'ERROR', error: error.message });
    }
    
    // Перевірка бази даних
    try {
        const mongoose = require('mongoose');
        const isConnected = mongoose.connection.readyState === 1;
        results.push({ service: 'MongoDB', status: isConnected ? 'OK' : 'ERROR' });
    } catch (error) {
        results.push({ service: 'MongoDB', status: 'ERROR', error: error.message });
    }
    
    console.log(JSON.stringify(results, null, 2));
    
    // Запис результатів
    fs.writeFileSync('health-check.json', JSON.stringify(results, null, 2));
    
    return results.every(r => r.status === 'OK');
}

healthCheck().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
});
EOF
    
    mkdir -p scripts
    chmod +x scripts/health-check.js
    
    log "✅ Моніторинг налаштовано"
}

# Створення backup скрипта
setup_backup() {
    log "Налаштовуємо backup..."
    
    cat > scripts/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backup"
DB_NAME="crypto_bot"

mkdir -p $BACKUP_DIR

# MongoDB backup
if command -v mongodump &> /dev/null; then
    mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE
    tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/$DATE
    rm -rf $BACKUP_DIR/$DATE
    
    # Видалення старих backup (30 днів)
    find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
    
    echo "MongoDB backup completed: backup_$DATE.tar.gz"
else
    echo "mongodump not found. Using alternative backup method..."
    cp -r src/logs $BACKUP_DIR/logs_$DATE
    tar -czf $BACKUP_DIR/logs_backup_$DATE.tar.gz $BACKUP_DIR/logs_$DATE
    rm -rf $BACKUP_DIR/logs_$DATE
fi

# Конфігурація backup
cp .env $BACKUP_DIR/env_backup_$DATE
cp package.json $BACKUP_DIR/package_backup_$DATE

echo "Backup completed: $DATE"
EOF
    
    chmod +x scripts/backup.sh
    
    log "✅ Backup налаштовано"
}

# Головна функція
main() {
    echo -e "${BLUE}"
    echo "🚀 Crypto Telegram Bot - Автоматичне розгортання"
    echo "=================================================="
    echo -e "${NC}"
    
    # Перевірка аргументів
    case ${1:-"deploy"} in
        "install")
            check_system
            install_dependencies
            setup_config
            ;;
        "test")
            run_tests
            ;;
        "deploy")
            check_system
            install_dependencies
            setup_config
            run_tests
            deploy_production
            setup_monitoring
            setup_backup
            ;;
        "monitoring")
            setup_monitoring
            ;;
        "backup")
            setup_backup
            ;;
        "health")
            node scripts/health-check.js
            ;;
        *)
            echo "Використання: $0 [install|test|deploy|monitoring|backup|health]"
            echo ""
            echo "Команди:"
            echo "  install    - Встановлення залежностей та конфігурації"
            echo "  test       - Запуск тестів"
            echo "  deploy     - Повне розгортання (за замовчуванням)"
            echo "  monitoring - Налаштування моніторингу"
            echo "  backup     - Налаштування backup"
            echo "  health     - Перевірка стану системи"
            exit 1
            ;;
    esac
    
    log "🎉 Операція завершена успішно!"
    
    if [ "${1:-"deploy"}" == "deploy" ]; then
        echo ""
        echo -e "${GREEN}Ваш Crypto Telegram Bot розгорнуто!${NC}"
        echo ""
        echo "Корисні команди:"
        echo "  pm2 status          - Статус процесів"
        echo "  pm2 logs crypto-bot - Логи бота"
        echo "  pm2 monit           - Моніторинг"
        echo "  ./scripts/backup.sh - Створення backup"
        echo "  node scripts/health-check.js - Перевірка здоров'я"
        echo ""
        echo "Логи зберігаються в: src/logs/"
        echo "Конфігурація PM2: ecosystem.config.js"
    fi
}

# Запуск
main "$@"
