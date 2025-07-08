# 🚀 Crypto Telegram Bot - PowerShell Deployment Script

param(
    [Parameter(Position=0)]
    [ValidateSet("install", "test", "deploy", "monitoring", "backup", "health")]
    [string]$Action = "deploy"
)

# Функції для логування з кольорами
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] WARNING: $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ERROR: $Message" -ForegroundColor Red
    exit 1
}

# Перевірка системи
function Test-System {
    Write-Log "Перевіряємо системні вимоги..."
    
    # Перевірка Node.js
    try {
        $nodeVersion = node --version
        $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($versionNumber -lt 18) {
            Write-Error "Потрібна версія Node.js 18+. Поточна версія: $nodeVersion"
        }
    }
    catch {
        Write-Error "Node.js не встановлено. Встановіть Node.js 18+ LTS з https://nodejs.org/"
    }
    
    # Перевірка npm
    try {
        npm --version | Out-Null
    }
    catch {
        Write-Error "npm не встановлено"
    }
    
    # Перевірка PM2
    try {
        pm2 --version | Out-Null
    }
    catch {
        Write-Log "Встановлюємо PM2..."
        npm install -g pm2
    }
    
    Write-Log "✅ Системні вимоги виконані"
}

# Встановлення залежностей
function Install-Dependencies {
    Write-Log "Встановлюємо залежності..."
    
    if (Test-Path "package-lock.json") {
        npm ci --only=production
    } else {
        npm install --only=production
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Помилка встановлення залежностей"
    }
    
    Write-Log "✅ Залежності встановлено"
}

# Конфігурація
function Set-Configuration {
    Write-Log "Налаштовуємо конфігурацію..."
    
    # Перевірка .env файлу
    if (-not (Test-Path ".env")) {
        if (Test-Path "example.env") {
            Copy-Item "example.env" ".env"
            Write-Warning "Створено .env файл з example.env. Будь ласка, налаштуйте змінні оточення"
            Write-Host ""
            Write-Host "Редагуйте .env файл:"
            Write-Host "notepad .env"
            Write-Host ""
            Write-Host "Обов'язкові параметри:"
            Write-Host "- BOT_TOKEN=your_telegram_bot_token"
            Write-Host "- MONGO_URI=your_mongodb_connection_string"
            Write-Host ""
            Read-Host "Натисніть Enter після налаштування .env файлу"
        } else {
            Write-Error ".env файл не знайдено та example.env відсутній"
        }
    }
    
    # Перевірка обов'язкових параметрів
    $envContent = Get-Content ".env" -Raw
    if (-not ($envContent -match "BOT_TOKEN=") -or -not ($envContent -match "MONGO_URI=")) {
        Write-Error "Обов'язкові параметри BOT_TOKEN та MONGO_URI не налаштовані в .env"
    }
    
    # Створення папок
    @("src\logs", "backup", "scripts") | ForEach-Object {
        if (-not (Test-Path $_)) {
            New-Item -ItemType Directory -Path $_ -Force | Out-Null
        }
    }
    
    Write-Log "✅ Конфігурацію налаштовано"
}

# Тестування
function Invoke-Tests {
    Write-Log "Запускаємо тести..."
    
    # Перевірка синтаксису
    if (Test-Path "package.json") {
        try {
            npm run test 2>$null
        }
        catch {
            Write-Warning "Тести не пройдені або не налаштовані"
        }
    }
    
    # Перевірка JSON файлів
    if (Test-Path "translate.json") {
        try {
            node -e "JSON.parse(require('fs').readFileSync('translate.json', 'utf8'))"
        }
        catch {
            Write-Error "translate.json містить помилки"
        }
    }
    
    Write-Log "✅ Тести завершено"
}

# Запуск в продакшні
function Deploy-Production {
    Write-Log "Розгортаємо в продакшні..."
    
    # Зупинка існуючих процесів
    @("crypto-bot", "crypto-worker") | ForEach-Object {
        pm2 stop $_ 2>$null
        pm2 delete $_ 2>$null
    }
    
    # Запуск з PM2
    if (Test-Path "ecosystem.config.js") {
        pm2 start ecosystem.config.js
    } else {
        pm2 start src/bot.js --name crypto-bot
        pm2 start src/worker.js --name crypto-worker
    }
    
    # Збереження конфігурації PM2
    pm2 save
    
    Write-Log "✅ Розгортання завершено"
}

# Налаштування моніторингу
function Set-Monitoring {
    Write-Log "Налаштовуємо моніторинг..."
    
    # Встановлення PM2 плагінів
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 30
    pm2 set pm2-logrotate:compress true
    
    # Створення скрипта health check
    $healthCheckScript = @"
const axios = require('axios');
const fs = require('fs');

async function healthCheck() {
    const results = [];
    
    // Перевірка Telegram API
    try {
        const response = await axios.get(`https://api.telegram.org/bot`+process.env.BOT_TOKEN+`/getMe`);
        results.push({ service: 'Telegram', status: 'OK' });
    } catch (error) {
        results.push({ service: 'Telegram', status: 'ERROR', error: error.message });
    }
    
    console.log(JSON.stringify(results, null, 2));
    fs.writeFileSync('health-check.json', JSON.stringify(results, null, 2));
    
    return results.every(r => r.status === 'OK');
}

healthCheck().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
});
"@
    
    Set-Content -Path "scripts\health-check.js" -Value $healthCheckScript -Encoding UTF8
    
    Write-Log "✅ Моніторинг налаштовано"
}

# Створення backup скрипта
function Set-Backup {
    Write-Log "Налаштовуємо backup..."
    
    $backupScript = @"
`$date = Get-Date -Format "yyyyMMdd_HHmmss"
`$backupDir = "backup"
`$dbName = "crypto_bot"

if (-not (Test-Path `$backupDir)) {
    New-Item -ItemType Directory -Path `$backupDir -Force | Out-Null
}

Write-Host "Backup configuration..."
Copy-Item ".env" "`$backupDir\env_backup_`$date"
Copy-Item "package.json" "`$backupDir\package_backup_`$date"

Write-Host "Backup logs..."
if (Test-Path "src\logs") {
    Copy-Item "src\logs" "`$backupDir\logs_`$date" -Recurse
}

Write-Host "Backup completed: `$date"
"@
    
    Set-Content -Path "scripts\backup.ps1" -Value $backupScript -Encoding UTF8
    
    Write-Log "✅ Backup налаштовано"
}

# Головна функція
function Main {
    Write-Host ""
    Write-Host "🚀 Crypto Telegram Bot - Автоматичне розгортання" -ForegroundColor Blue
    Write-Host "==================================================" -ForegroundColor Blue
    Write-Host ""
    
    switch ($Action) {
        "install" {
            Test-System
            Install-Dependencies
            Set-Configuration
        }
        "test" {
            Invoke-Tests
        }
        "deploy" {
            Test-System
            Install-Dependencies
            Set-Configuration
            Invoke-Tests
            Deploy-Production
            Set-Monitoring
            Set-Backup
        }
        "monitoring" {
            Set-Monitoring
        }
        "backup" {
            Set-Backup
        }
        "health" {
            node scripts\health-check.js
        }
    }
    
    Write-Log "🎉 Операція завершена успішно!"
    
    if ($Action -eq "deploy") {
        Write-Host ""
        Write-Host "Ваш Crypto Telegram Bot розгорнуто!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Корисні команди:"
        Write-Host "  pm2 status          - Статус процесів"
        Write-Host "  pm2 logs crypto-bot - Логи бота"
        Write-Host "  pm2 monit           - Моніторинг"
        Write-Host "  .\scripts\backup.ps1 - Створення backup"
        Write-Host "  node scripts\health-check.js - Перевірка здоров'я"
        Write-Host ""
        Write-Host "Логи зберігаються в: src\logs\"
        Write-Host "Конфігурація PM2: ecosystem.config.js"
    }
}

# Запуск скрипта
try {
    Main
}
catch {
    Write-Error "Критична помилка: $($_.Exception.Message)"
}
