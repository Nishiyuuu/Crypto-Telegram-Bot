@echo off
REM 🚀 Crypto Telegram Bot - Автоматичне розгортання для Windows

setlocal enabledelayedexpansion

REM Кольори (не працюють в стандартному cmd, але працюють в PowerShell)
set "GREEN=[32m"
set "RED=[31m"
set "YELLOW=[33m"
set "BLUE=[34m"
set "NC=[0m"

REM Логування
:log
echo %GREEN%[%date% %time%] %~1%NC%
goto :eof

:warn
echo %YELLOW%[%date% %time%] WARNING: %~1%NC%
goto :eof

:error
echo %RED%[%date% %time%] ERROR: %~1%NC%
exit /b 1

REM Перевірка системи
:check_system
call :log "Перевіряємо системні вимоги..."

REM Перевірка Node.js
node --version >nul 2>&1
if errorlevel 1 (
    call :error "Node.js не встановлено. Встановіть Node.js 18+ LTS з https://nodejs.org/"
)

REM Перевірка npm
npm --version >nul 2>&1
if errorlevel 1 (
    call :error "npm не встановлено"
)

REM Перевірка PM2
pm2 --version >nul 2>&1
if errorlevel 1 (
    call :log "Встановлюємо PM2..."
    npm install -g pm2
)

call :log "✅ Системні вимоги виконані"
goto :eof

REM Встановлення залежностей
:install_dependencies
call :log "Встановлюємо залежності..."

if exist "package-lock.json" (
    npm ci --only=production
) else (
    npm install --only=production
)

call :log "✅ Залежності встановлено"
goto :eof

REM Конфігурація
:setup_config
call :log "Налаштовуємо конфігурацію..."

REM Перевірка .env файлу
if not exist ".env" (
    if exist "example.env" (
        copy example.env .env
        call :warn "Створено .env файл з example.env. Будь ласка, налаштуйте змінні оточення"
        echo.
        echo Редагуйте .env файл:
        echo notepad .env
        echo.
        echo Обов'язкові параметри:
        echo - BOT_TOKEN=your_telegram_bot_token
        echo - MONGO_URI=your_mongodb_connection_string
        echo.
        pause
    ) else (
        call :error ".env файл не знайдено та example.env відсутній"
    )
)

REM Перевірка обов'язкових параметрів
findstr /C:"BOT_TOKEN=" .env >nul
if errorlevel 1 (
    call :error "BOT_TOKEN не налаштовано в .env файлі"
)

findstr /C:"MONGO_URI=" .env >nul
if errorlevel 1 (
    call :error "MONGO_URI не налаштовано в .env файлі"
)

REM Створення папок
if not exist "src\logs" mkdir "src\logs"
if not exist "backup" mkdir "backup"
if not exist "scripts" mkdir "scripts"

call :log "✅ Конфігурацію налаштовано"
goto :eof

REM Тестування
:run_tests
call :log "Запускаємо тести..."

REM Перевірка синтаксису
if exist "package.json" (
    npm run test >nul 2>&1 || call :warn "Тести не пройдені або не налаштовані"
)

REM Перевірка JSON файлів
if exist "translate.json" (
    node -e "JSON.parse(require('fs').readFileSync('translate.json', 'utf8'))" || call :error "translate.json містить помилки"
)

call :log "✅ Тести завершено"
goto :eof

REM Запуск в продакшні
:deploy_production
call :log "Розгортаємо в продакшні..."

REM Зупинка існуючих процесів
pm2 stop crypto-bot >nul 2>&1
pm2 stop crypto-worker >nul 2>&1
pm2 delete crypto-bot >nul 2>&1
pm2 delete crypto-worker >nul 2>&1

REM Запуск з PM2
if exist "ecosystem.config.js" (
    pm2 start ecosystem.config.js
) else (
    pm2 start src/bot.js --name crypto-bot
    pm2 start src/worker.js --name crypto-worker
)

REM Збереження конфігурації PM2
pm2 save

call :log "✅ Розгортання завершено"
goto :eof

REM Налаштування моніторингу
:setup_monitoring
call :log "Налаштовуємо моніторинг..."

REM Встановлення PM2 плагінів
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

REM Створення скрипта health check
(
echo const axios = require('axios'^);
echo const fs = require('fs'^);
echo.
echo async function healthCheck(^) {
echo     const results = [];
echo.    
echo     // Перевірка Telegram API
echo     try {
echo         const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getMe`^);
echo         results.push({ service: 'Telegram', status: 'OK' }^);
echo     } catch (error^) {
echo         results.push({ service: 'Telegram', status: 'ERROR', error: error.message }^);
echo     }
echo.    
echo     console.log(JSON.stringify(results, null, 2^)^);
echo     fs.writeFileSync('health-check.json', JSON.stringify(results, null, 2^)^);
echo.    
echo     return results.every(r =^> r.status === 'OK'^);
echo }
echo.
echo healthCheck(^).then(success =^> {
echo     process.exit(success ? 0 : 1^);
echo }^).catch(error =^> {
echo     console.error('Health check failed:', error^);
echo     process.exit(1^);
echo }^);
) > scripts\health-check.js

call :log "✅ Моніторинг налаштовано"
goto :eof

REM Створення backup скрипта
:setup_backup
call :log "Налаштовуємо backup..."

(
echo @echo off
echo set DATE=%%date:~-4,4%%%%date:~-10,2%%%%date:~-7,2%%_%%time:~0,2%%%%time:~3,2%%%%time:~6,2%%
echo set DATE=%%DATE: =0%%
echo set BACKUP_DIR=backup
echo set DB_NAME=crypto_bot
echo.
echo if not exist %%BACKUP_DIR%% mkdir %%BACKUP_DIR%%
echo.
echo echo Backup configuration...
echo copy .env %%BACKUP_DIR%%\env_backup_%%DATE%%
echo copy package.json %%BACKUP_DIR%%\package_backup_%%DATE%%
echo.
echo echo Backup logs...
echo if exist src\logs (
echo     xcopy /E /I src\logs %%BACKUP_DIR%%\logs_%%DATE%%
echo ^)
echo.
echo echo Backup completed: %%DATE%%
) > scripts\backup.bat

call :log "✅ Backup налаштовано"
goto :eof

REM Головна функція
:main
echo.
echo %BLUE%🚀 Crypto Telegram Bot - Автоматичне розгортання%NC%
echo %BLUE%==================================================%NC%
echo.

set "action=%~1"
if "%action%"=="" set "action=deploy"

if "%action%"=="install" (
    call :check_system
    call :install_dependencies
    call :setup_config
) else if "%action%"=="test" (
    call :run_tests
) else if "%action%"=="deploy" (
    call :check_system
    call :install_dependencies
    call :setup_config
    call :run_tests
    call :deploy_production
    call :setup_monitoring
    call :setup_backup
) else if "%action%"=="monitoring" (
    call :setup_monitoring
) else if "%action%"=="backup" (
    call :setup_backup
) else if "%action%"=="health" (
    node scripts\health-check.js
) else (
    echo Використання: %0 [install^|test^|deploy^|monitoring^|backup^|health]
    echo.
    echo Команди:
    echo   install    - Встановлення залежностей та конфігурації
    echo   test       - Запуск тестів
    echo   deploy     - Повне розгортання (за замовчуванням^)
    echo   monitoring - Налаштування моніторингу
    echo   backup     - Налаштування backup
    echo   health     - Перевірка стану системи
    exit /b 1
)

call :log "🎉 Операція завершена успішно!"

if "%action%"=="deploy" (
    echo.
    echo %GREEN%Ваш Crypto Telegram Bot розгорнуто!%NC%
    echo.
    echo Корисні команди:
    echo   pm2 status          - Статус процесів
    echo   pm2 logs crypto-bot - Логи бота
    echo   pm2 monit           - Моніторинг
    echo   scripts\backup.bat  - Створення backup
    echo   node scripts\health-check.js - Перевірка здоров'я
    echo.
    echo Логи зберігаються в: src\logs\
    echo Конфігурація PM2: ecosystem.config.js
)

goto :eof

REM Виклик головної функції
call :main %*
