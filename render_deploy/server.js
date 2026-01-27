const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.env.PORT;

const server = http.createServer((req, res) => {
  console.log(`📥 Запрос: ${req.method} ${req.url}`);
  
  // Обработка API запросов
  if (req.url.startsWith('/api/')) {
    handleApiRequest(req, res);
    return;
  }

  let filePath = path.join(__dirname, req.url);
  if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, 'index.html');
  }
  
  console.log(`🔍 Ищем файл: ${filePath}`);

  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Убираем query параметры из пути файла
  if (filePath.includes('?')) {
    filePath = filePath.split('?')[0];
  }
  
  console.log(`🔧 Очищенный путь: ${filePath}`);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Проверяем существует ли файл
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Файл не существует: ${filePath}`);
    // Пробуем найти index.html
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
      console.log(`✅ Используем index.html: ${filePath}`);
    } else {
      console.log(`❌ Даже index.html не найден: ${indexPath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code === 'ENOENT') {
        console.log(`🔍 Файл не найден: ${filePath}`);
        fs.readFile(path.join(__dirname, 'index.html'), (error, content) => {
          res.writeHead(200, { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          });
          res.end(content, 'utf-8');
        });
      } else {
        console.log(`❌ Ошибка сервера: ${error.message}`);
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      // Добавляем заголовки для контроля кэша
      const cacheHeaders = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      
      // Для HTML файлов всегда отключаем кэш
      if (extname === '.html') {
        Object.assign(cacheHeaders, {
          'Content-Type': contentType
        });
      } else {
        // Для других файлов добавляем короткое кэширование
        cacheHeaders['Cache-Control'] = 'public, max-age=3600'; // 1 час
        Object.assign(cacheHeaders, {
          'Content-Type': contentType
        });
      }
      
      res.writeHead(200, cacheHeaders);
      res.end(content, 'utf-8');
      console.log(`✅ Файл успешно отправлен: ${filePath}`);
    }
  });
});

// Функция обработки API запросов
function handleApiRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Установка заголовков CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        if (pathname === '/api/order') {
          handleOrder(data, res);
        } else if (pathname === '/api/review') {
          handleReview(data, res);
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
      } catch (error) {
        console.log('❌ Ошибка парсинга JSON:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.method === 'GET') {
    if (pathname === '/api/orders') {
      handleGetOrders(res);
    } else if (pathname === '/api/reviews') {
      handleGetReviews(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
  } else if (req.method === 'PUT') {
    if (pathname.startsWith('/api/review/')) {
      const reviewId = pathname.split('/')[3];
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          handleApproveReview(reviewId, data, res);
        } catch (error) {
          console.log('❌ Ошибка парсинга JSON:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
}

// Одобрение отзыва
function handleApproveReview(reviewId, data, res) {
  console.log(`🔧 Сервер: получен запрос на одобрение отзыва ID: ${reviewId}`);
  
  const reviewsFile = './reviews.json';
  let reviews = [];
  
  try {
    if (fs.existsSync(reviewsFile)) {
      const fileData = fs.readFileSync(reviewsFile, 'utf8');
      reviews = JSON.parse(fileData);
      console.log(`📁 Загружено ${reviews.length} отзывов из файла`);
    } else {
      console.log('⚠️ Файл reviews.json не существует');
    }
  } catch (error) {
    console.log('⚠️ Ошибка чтения файла отзывов:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Server error' }));
    return;
  }
  
  // Находим отзыв по ID
  const reviewIndex = reviews.findIndex(review => review.id == reviewId);
  console.log(`🔍 Поиск отзыва: найден индекс ${reviewIndex}`);
  
  if (reviewIndex === -1) {
    console.log(`❌ Отзыв с ID ${reviewId} не найден`);
    console.log('📋 Доступные ID:', reviews.map(r => r.id));
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Review not found' }));
    return;
  }
  
  // Одобряем отзыв
  reviews[reviewIndex].approved = true;
  reviews[reviewIndex].approvedAt = new Date().toISOString();
  
  console.log(`✅ Отзыв ${reviewId} одобрен!`);
  console.log(`📝 Имя: ${reviews[reviewIndex].name}`);
  console.log(`⭐ Оценка: ${reviews[reviewIndex].rating}`);
  
  // Сохраняем обновленный список
  try {
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2), 'utf8');
    console.log(`💾 Отзыв сохранен в файл`);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true, 
      message: 'Отзыв одобрен',
      review: reviews[reviewIndex]
    }));
  } catch (error) {
    console.log('❌ Ошибка сохранения отзыва:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Server error' }));
  }
}

// Получение всех заказов
function handleGetOrders(res) {
  const ordersFile = './orders.json';
  let orders = [];
  
  try {
    if (fs.existsSync(ordersFile)) {
      const data = fs.readFileSync(ordersFile, 'utf8');
      orders = JSON.parse(data);
    }
  } catch (error) {
    console.log('⚠️ Ошибка чтения файла заказов:', error.message);
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(orders));
}

// Получение всех отзывов
function handleGetReviews(res) {
  const reviewsFile = './reviews.json';
  let reviews = [];
  
  try {
    if (fs.existsSync(reviewsFile)) {
      const data = fs.readFileSync(reviewsFile, 'utf8');
      reviews = JSON.parse(data);
    }
  } catch (error) {
    console.log('⚠️ Ошибка чтения файла отзывов:', error.message);
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(reviews));
}

// Обработка заказа
function handleOrder(order, res) {
  console.log('\n🔔 НОВЫЙ ЗАКАЗ!');
  console.log('================');
  console.log(`📅 Время: ${new Date().toLocaleString('ru-RU')}`);
  console.log(`👤 Имя: ${order.name}`);
  console.log(`📞 Телефон: ${order.phone}`);
  console.log(`📧 Email: ${order.email}`);
  console.log(`📋 Проект: ${order.projectType}`);
  console.log(`💰 Цена: ${order.price} ₽`);
  console.log(`💳 Способ оплаты: ${order.paymentMethod || 'Не указан'}`);
  console.log(`📝 Описание: ${order.description}`);
  console.log(`⚡ Срочность: ${order.urgency || 'Обычная'}`);
  console.log('================\n');
  
  // Сохраняем заказ в файл
  const orderWithTimestamp = {
    ...order,
    timestamp: new Date().toISOString(),
    id: Date.now()
  };
  
  saveOrderToFile(orderWithTimestamp);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    success: true, 
    message: 'Заказ получен и обработан',
    id: orderWithTimestamp.id
  }));
}

// Обработка отзыва
function handleReview(review, res) {
  console.log('\n⭐ НОВЫЙ ОТЗЫВ!');
  console.log('================');
  console.log(`📅 Время: ${new Date().toLocaleString('ru-RU')}`);
  console.log(`👤 Имя: ${review.name}`);
  console.log(`📧 Email: ${review.email || 'Не указан'}`);
  console.log(`📋 Проект: ${review.project || 'Не указан'}`);
  console.log(`⭐ Оценка: ${'⭐'.repeat(review.rating)}`);
  console.log(`📝 Текст: "${review.text}"`);
  console.log(`✅ Разрешение на публикацию: ${review.permission ? 'Да' : 'Нет'}`);
  console.log('================\n');
  
  // Сохраняем отзыв в файл
  const reviewWithTimestamp = {
    ...review,
    timestamp: new Date().toISOString(),
    id: Date.now(),
    // Если клиент разрешил публикацию, отзыв сразу одобрен
    approved: review.permission ? true : false,
    approvedAt: review.permission ? new Date().toISOString() : null
  };
  
  saveReviewToFile(reviewWithTimestamp);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    success: true, 
    message: review.permission ? 'Отзыв получен и опубликован' : 'Отзыв получен и ожидает модерации',
    id: reviewWithTimestamp.id,
    approved: reviewWithTimestamp.approved
  }));
}

// Сохранение заказа в файл
function saveOrderToFile(order) {
  const ordersFile = './orders.json';
  let orders = [];
  
  try {
    if (fs.existsSync(ordersFile)) {
      const data = fs.readFileSync(ordersFile, 'utf8');
      orders = JSON.parse(data);
    }
  } catch (error) {
    console.log('⚠️ Ошибка чтения файла заказов:', error.message);
  }
  
  orders.push(order);
  
  try {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf8');
    console.log('✅ Заказ сохранен в файл orders.json');
  } catch (error) {
    console.log('❌ Ошибка сохранения заказа:', error.message);
  }
}

// Сохранение отзыва в файл
function saveReviewToFile(review) {
  const reviewsFile = './reviews.json';
  let reviews = [];
  
  try {
    if (fs.existsSync(reviewsFile)) {
      const data = fs.readFileSync(reviewsFile, 'utf8');
      reviews = JSON.parse(data);
    }
  } catch (error) {
    console.log('⚠️ Ошибка чтения файла отзывов:', error.message);
  }
  
  reviews.push(review);
  
  try {
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2), 'utf8');
    console.log('✅ Отзыв сохранен в файл reviews.json');
  } catch (error) {
    console.log('❌ Ошибка сохранения отзыва:', error.message);
  }
}

server.listen(port, () => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
  console.log(`🔧 Переменная окружения PORT: ${process.env.PORT}`);
  console.log(`📂 Текущая директория: ${__dirname}`);
  
  // Проверяем ключевые файлы
  const filesToCheck = ['index.html', 'style.css', 'script.js'];
  filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${file}: ${filePath}`);
  });
  
  console.log(`📊 API эндпоинты:`);
  console.log(`   POST /api/order - обработка заказов`);
  console.log(`   POST /api/review - обработка отзывов`);
  console.log(`   GET  /api/orders - получение всех заказов`);
  console.log(`   GET  /api/reviews - получение всех отзывов`);
  console.log(`   PUT  /api/review/:id - одобрение отзыва`);
  console.log(`📁 Файлы для сохранения:`);
  console.log(`   orders.json - заказы`);
  console.log(`   reviews.json - отзывы`);
  console.log('================');
});
