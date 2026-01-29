@echo off
title Server Auto-Restart
echo Запускаем сервер с автоматическим перезапуском...

:loop
echo [%time%] Запускаем сервер...
node server.js

if %ERRORLEVEL% NEQ 0 (
    echo [%time%] Сервер упал с ошибкой %ERRORLEVEL%. Перезапуск через 5 секунд...
    timeout /t 5 /nobreak >nul
) else (
    echo [%time%] Сервер остановлен. Перезапуск через 2 секунды...
    timeout /t 2 /nobreak >nul
)

goto loop
