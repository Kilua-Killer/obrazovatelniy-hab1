const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Статические файлы из текущей папки (src)
app.use(express.static(__dirname));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Админ панель
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Образовательный Хаб 3D'
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Образовательный Хаб 3D сервер запущен!`);
    console.log(`📍 Порт: ${PORT}`);
    console.log(`🌐 Сайт доступен по адресу: http://localhost:${PORT}`);
    console.log(`🎯 3D анимации работают!`);
});

module.exports = app;
