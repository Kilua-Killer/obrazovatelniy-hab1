#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Запускаем сервер с автоматическим перезапуском...');

function startServer() {
    const serverProcess = spawn('node', ['server.js'], {
        stdio: 'inherit',
        cwd: __dirname
    });

    serverProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`❌ Сервер упал с кодом ${code}. Перезапуск через 3 секунды...`);
            setTimeout(startServer, 3000);
        } else {
            console.log('✅ Сервер остановлен. Перезапуск через 1 секунду...');
            setTimeout(startServer, 1000);
        }
    });

    serverProcess.on('error', (error) => {
        console.log(`💥 Ошибка сервера: ${error.message}. Перезапуск через 5 секунд...`);
        setTimeout(startServer, 5000);
    });
}

// Запускаем сервер
startServer();
