// Улучшенная система parallax и scroll-эффектов с оптимизацией
class ScrollController {
    constructor() {
        this.scrollY = window.pageYOffset; // Начинаем с текущей позиции
        this.targetScrollY = window.pageYOffset; // Целевая позиция такая же
        this.sections = [];
        this.scrollProgress = 0;
        this.isTicking = false;
        this.lastScrollTime = 0;
        this.scrollThrottle = 20; // Увеличим для плавности
        this.scrollUpdateCounter = 0;
        this.lastBackgroundUpdate = 0;
        this.init();
    }

    init() {
        this.detectSections();
        this.createEventListeners();
        this.animate();
    }

    detectSections() {
        this.sections = [
            { element: document.querySelector('.hero'), name: 'hero', speed: 0.5 },
            { element: document.querySelector('.features'), name: 'features', speed: 0.3 },
            { element: document.querySelector('.projects'), name: 'projects', speed: 0.4 },
            { element: document.querySelector('.calculator'), name: 'calculator', speed: 0.2 },
            { element: document.querySelector('footer'), name: 'footer', speed: 0.1 }
        ].filter(section => section.element);
    }

    createEventListeners() {
        // Оптимизированный обработчик скролла с throttling
        window.addEventListener('scroll', () => this.onScrollThrottled(), { passive: true });
        window.addEventListener('resize', () => this.detectSections());
    }

    onScrollThrottled() {
        const now = performance.now();
        if (now - this.lastScrollTime >= this.scrollThrottle) {
            this.onScroll();
            this.lastScrollTime = now;
        }
        
        if (!this.isTicking) {
            requestAnimationFrame(() => {
                this.updateScrollProgress();
                this.updateScrollIndicator();
                // Разделяем обновления для плавности
                if (this.scrollUpdateCounter % 2 === 0) {
                    this.updateParallax();
                }
                this.scrollUpdateCounter++;
                this.isTicking = false;
            });
            this.isTicking = true;
        }
    }

    onScroll() {
        this.targetScrollY = window.pageYOffset;
    }

    updateScrollProgress() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = this.scrollY / maxScroll;
        
        const progressBar = document.getElementById('scrollProgress');
        if (progressBar) {
            progressBar.style.width = `${this.scrollProgress * 100}%`;
        }
    }

    updateScrollIndicator() {
        const indicator = document.getElementById('scrollIndicator');
        if (indicator) {
            if (this.scrollY > 100) {
                indicator.classList.add('hidden');
            } else {
                indicator.classList.remove('hidden');
            }
        }
    }

    updateParallax() {
        // Кэшируем значения для оптимизации
        const scrollY = this.scrollY;
        
        // Упрощенный parallax для секций (только для видимых)
        this.sections.forEach(section => {
            if (!section.element) return;
            
            const rect = section.element.getBoundingClientRect();
            // Обрабатываем только видимые секции
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            
            const speed = section.speed;
            
            // Parallax для фона секции
            const yPos = -(rect.top * speed);
            section.element.style.setProperty('--parallax-y', `${yPos}px`);
            
            // Упрощенный parallax для дочерних элементов (только видимых)
            const children = section.element.querySelectorAll('.feature-card, .project-card');
            children.forEach((child, index) => {
                const childRect = child.getBoundingClientRect();
                // Пропускаем невидимые элементы
                if (childRect.bottom < 0 || childRect.top > window.innerHeight) return;
                
                const childSpeed = speed + (index * 0.03);
                const childYPos = -(rect.top * childSpeed);
                child.style.transform = `translateY(${childYPos * 0.03}px)`;
            });
        });
        
        // Упрощенный hero parallax эффект (только если hero виден)
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroRect = hero.getBoundingClientRect();
            if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
                const heroContent = hero.querySelector('.container');
                
                if (heroContent) {
                    // Минимальный parallax
                    hero.style.transform = `translateY(${scrollY * 0.15}px)`;
                    heroContent.style.transform = `translateY(${scrollY * 0.08}px)`;
                    hero.style.opacity = Math.max(0.6, 1 - scrollY / 600);
                }
            }
        }
        
        // Упрощенное изменение фона (только при значительном скролле)
        if (Math.abs(scrollY - this.lastBackgroundUpdate) > 100) {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = scrollY / maxScroll;
            
            if (scrollPercentage > 0.6) {
                document.body.style.background = 'linear-gradient(135deg, #333333 0%, #666666 100%)';
            } else {
                document.body.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
            }
            this.lastBackgroundUpdate = scrollY;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Плавная прокрутка с оптимизацией - только если пользователь прокрутил
        const diff = this.targetScrollY - this.scrollY;
        if (Math.abs(diff) > 0.1) {
            this.scrollY += diff * 0.1;
            
            // Обновляем CSS переменные только при изменении
            document.documentElement.style.setProperty('--scroll-y', `${this.scrollY}px`);
            document.documentElement.style.setProperty('--scroll-progress', this.scrollProgress);
        }
    }
    
    // Метод для остановки автоматической прокрутки
    stopAutoScroll() {
        this.targetScrollY = window.pageYOffset;
        this.scrollY = window.pageYOffset;
    }
}
const basePrices = {
    bot: { low: 3000, medium: 5000, high: 8000 },
    website: { low: 4000, medium: 7000, high: 12000 },
    mobile: { low: 6000, medium: 10000, high: 16000 },
    science: { low: 2000, medium: 3500, high: 6000 }
};

const customizationPrice = {
    no: 0,
    text: 2000,
    design: 5000,
    full: 8000
};

const urgencyMultiplier = {
    normal: 1,
    urgent: 1.5,
    superUrgent: 2
};

// Мобильное меню - делаем функции глобальными
window.toggleMobileMenu = function() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
};

window.closeMobileMenu = function() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
};

function calculatePrice() {
    const projectType = document.getElementById('projectType').value;
    const complexity = document.getElementById('complexity').value;
    const urgency = document.getElementById('urgency').value;
    const customization = document.getElementById('customization').value;
    
    const basePrice = basePrices[projectType][complexity];
    const urgencyPrice = basePrice * urgencyMultiplier[urgency];
    const customizationCost = customizationPrice[customization];
    const totalPrice = urgencyPrice + customizationCost;
    
    const deadline = Math.ceil(7 * urgencyDays[urgency]);
    
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString('ru-RU');
    document.getElementById('deadline').textContent = deadline;
}

const urgencyDays = {
    normal: 1,
    urgent: 0.6,
    superUrgent: 0.4
};

// Отправка заказа на email через EmailJS
function sendOrderEmail(order) {
    const paymentMethod = document.getElementById('paymentMethod');
    const paymentText = paymentMethod.options[paymentMethod.selectedIndex].text;
    
    const templateParams = {
        name: order.name,
        phone: order.phone,
        email: order.email,
        project_type: order.projectType,
        description: order.description,
        payment_method: paymentText,
        timestamp: new Date(order.timestamp).toLocaleString('ru-RU')
    };
    
    // Отправляем на сервер для логирования
    sendOrderToServer(order);
    
    emailjs.send('service_6ogl5un', 'template_9012236', templateParams)
        .then(function(response) {
            console.log('✅ Email успешно отправлен!', response.status, response.text);
            
            // Очистка формы
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('email').value = '';
            document.getElementById('projectSubject').value = '';
            document.getElementById('description').value = '';
            
            // Возвращаем кнопку в исходное состояние
            const button = document.querySelector('#orderForm button[type="submit"]');
            if (button) {
                button.innerHTML = 'Отправить заявку';
                button.disabled = false;
            }
            
            // Показываем одно понятное сообщение
            showNotification('✅ Заявка успешно отправлена! Реквизиты для оплаты отправим на ваш email в течение 1 часа.', 'success');
            
            // Эффект конфетти
            createConfetti();
            
            // Закрываем модальное окно через 3 секунды
            setTimeout(() => {
                const modal = document.querySelector('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }, 3000);
        })
        .catch(function(error) {
            console.log('❌ Ошибка отправки email:', error);
            
            // Возвращаем кнопку в исходное состояние
            const button = document.querySelector('#orderForm button[type="submit"]');
            if (button) {
                button.innerHTML = 'Отправить заявку';
                button.disabled = false;
            }
            
            showNotification('⚠️ Ошибка отправки email. Данные сохранены локально.', 'error');
        });
}

// Система уведомлений
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const content = document.getElementById('notification-content');
    
    notification.className = `notification ${type}`;
    content.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Обработчики событий
document.getElementById('projectType').addEventListener('change', calculatePrice);
document.getElementById('complexity').addEventListener('change', calculatePrice);
document.getElementById('urgency').addEventListener('change', calculatePrice);
document.getElementById('customization').addEventListener('change', calculatePrice);

// Обработка формы отзывов
document.getElementById('testimonialForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('reviewerName').value;
    const email = document.getElementById('reviewerEmail').value;
    const project = document.getElementById('reviewProject').value;
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value;
    const permission = document.getElementById('reviewPermission').checked;
    
    if (!name || !text || !permission) {
        showNotification('⚠️ Заполните все обязательные поля', 'error');
        return;
    }
    
    // Сохраняем отзыв в localStorage
    const review = {
        id: Date.now(),
        name: name,
        email: email,
        project: project,
        rating: rating,
        text: text,
        date: new Date().toLocaleDateString('ru-RU'),
        approved: false // Отзывы требуют модерации
    };
    
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.unshift(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Отправляем уведомление о новом отзыве
    sendReviewNotification(review);
    
    // Отправляем отзыв на сервер для логирования
    sendReviewToServer(review);
    
    // Очищаем форму
    document.getElementById('testimonialForm').reset();
    document.getElementById('reviewRating').value = '5';
    
    showNotification('✅ Спасибо за отзыв! Он будет опубликован после проверки.', 'success');
});

// Рейтинг звезды
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        const rating = this.getAttribute('data-rating');
        document.getElementById('reviewRating').value = rating;
        
        // Обновляем визуальное состояние звезд
        document.querySelectorAll('.star').forEach(s => {
            s.classList.remove('active');
        });
        
        for (let i = 1; i <= rating; i++) {
            const starElement = document.querySelector(`.star[data-rating="${i}"]`);
            if (starElement) {
                starElement.classList.add('active');
            }
        }
    });
    
    // Добавляем hover эффект
    star.addEventListener('mouseenter', function() {
        const rating = this.getAttribute('data-rating');
        document.querySelectorAll('.star').forEach(s => {
            s.classList.remove('active');
        });
        
        for (let i = 1; i <= rating; i++) {
            const starElement = document.querySelector(`.star[data-rating="${i}"]`);
            if (starElement) {
                starElement.classList.add('active');
            }
        }
    });
});

// Возвращаем исходное состояние при уходе мыши
document.querySelector('.rating-stars').addEventListener('mouseleave', function() {
    const currentRating = document.getElementById('reviewRating').value;
    document.querySelectorAll('.star').forEach(s => {
        s.classList.remove('active');
    });
    
    for (let i = 1; i <= currentRating; i++) {
        const starElement = document.querySelector(`.star[data-rating="${i}"]`);
        if (starElement) {
            starElement.classList.add('active');
        }
    }
});

// Отправка уведомления о новом отзыве
function sendReviewNotification(review) {
    const templateParams = {
        name: review.name,
        email: review.email,
        project: review.project,
        rating: '⭐'.repeat(review.rating),
        text: review.text,
        date: review.date,
        type: 'Новый отзыв'
    };
    
    // Используем тот же EmailJS для отправки уведомления
    emailjs.send('service_6ogl5un', 'template_9012236', templateParams)
        .then(function(response) {
            console.log('✅ Уведомление об отзыве отправлено!');
        })
        .catch(function(error) {
            console.log('❌ Ошибка отправки уведомления:', error);
        });
}

// Загрузка и отображение отзывов
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const reviewsGrid = document.getElementById('reviewsGrid');
    
    // Показываем только одобренные отзывы
    const approvedReviews = reviews.filter(review => review.approved);
    
    if (approvedReviews.length === 0) {
        reviewsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Пока нет отзывов. Будьте первым!</p>';
        return;
    }
    
    reviewsGrid.innerHTML = approvedReviews.map(review => `
        <div class="review-card fade-in">
            <div class="review-header">
                <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-content">
                <p>"${review.text}"</p>
            </div>
            <div class="review-footer">
                <div class="review-name">${review.name}</div>
                <div class="review-project">${getProjectName(review.project)}</div>
            </div>
        </div>
    `).join('');
}

// Получение названия проекта
function getProjectName(projectValue) {
    const projects = {
        'telegram-bot': '🤖 Telegram бот',
        'website': '🌐 Сайт/Платформа',
        'mobile-app': '📱 Мобильное приложение',
        'science-project': '🔬 Научный проект',
        'other': '💡 Другое'
    };
    return projects[projectValue] || 'Проект';
}

// Улучшенная обработка формы заказа
function submitOrder(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const projectSubject = document.getElementById('projectSubject').value;
    const description = document.getElementById('description').value;
    
    if (!name || !phone || !email || !projectSubject || !description) {
        showNotification('⚠️ Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('📧 Введите корректный email адрес', 'error');
        return;
    }
    
    // Валидация телефона
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
        showNotification('📞 Введите корректный номер телефона', 'error');
        return;
    }
    
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Показываем загрузку
    button.innerHTML = '<div class="loading-spinner"></div> Отправка...';
    button.disabled = true;
    
    // Сохраняем заявку в localStorage (имитация базы данных)
    const order = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        projectType: projectSubject,
        description: description,
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    // Получаем существующие заказы
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('Новая заявка:', order);
    console.log('Все заявки:', orders);
    
    // Отправляем данные на email
    sendOrderEmail(order);
    // Скрываем данные из консоли для безопасности
    setTimeout(() => {
        console.clear();
        console.log('🔒 Данные заказа защищены и отправлены на email');
    }, 5000);
}

// Эффект конфетти
function createConfetti() {
    const colors = ['#333333', '#666666', '#999999', '#000000', '#f8f9fa', '#e1e5e9'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random() * 0.8 + 0.2};
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const horizontalMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { 
                transform: `translateY(0) translateX(0) rotate(0deg)`,
                opacity: 1
            },
            { 
                transform: `translateY(100vh) translateX(${horizontalMovement}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Улучшенная анимация при прокрутке с parallax (максимально упрощенная)
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .feature-card, .project-card');
    
    // Обрабатываем только элементы рядом с экраном
    elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Расширенная зона для появления
        if (elementTop < windowHeight * 1.2) {
            if (!element.classList.contains('visible')) {
                element.classList.add('visible');
                
                // Минимальная анимация
                element.style.animation = 'fadeInUp 0.3s ease-out forwards';
            }
        }
    });
}

// Инициализация ScrollController
document.addEventListener('DOMContentLoaded', () => {
    // Предотвращаем автоскролл при загрузке
    if (window.history && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }
    
    // Фиксируем текущую позицию
    const currentScroll = window.pageYOffset;
    window.scrollTo(0, currentScroll);
    
    const scrollController = new ScrollController();
    // Останавливаем автоматическую прокрутку при загрузке
    setTimeout(() => {
        scrollController.stopAutoScroll();
        window.scrollTo(0, currentScroll);
    }, 100);
});

// Инициализация анимаций при загрузке (оптимизированная)
document.addEventListener('DOMContentLoaded', function() {
    // Запуск анимации при загрузке
    setTimeout(animateOnScroll, 100);
    
    // Первоначальный расчет цены
    calculatePrice();
    
    // Загрузка отзывов
    loadReviews();
    
    // Инициализация impressing hero эффектов
    initHeroAnimations();
    
    // Добавляем интерактивность карточкам с оптимизацией
    document.querySelectorAll('.feature-card, .project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.01)'; // Уменьшили эффект
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Показываем приветственное уведомление
    setTimeout(() => {
        showNotification('👋 Добро пожаловать в Образовательный Хаб! Готовы создать крутой проект?', 'info');
    }, 1000);
});

// Impressing Hero Animations
function initHeroAnimations() {
    // Typewriter Effect
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.getAttribute('data-text');
        element.textContent = '';
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 2000);
    });
    
    // Animated Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Dynamic word animation delays
    const words = document.querySelectorAll('.dynamic-headline .word');
    words.forEach((word, index) => {
        const delay = word.getAttribute('data-delay');
        word.style.animationDelay = `${delay}ms`;
    });
    
    // Interactive floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.opacity = '0.3';
            this.style.filter = 'blur(0px)';
            this.style.transform = 'scale(1.2)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.opacity = '0.1';
            this.style.filter = 'blur(1px)';
            this.style.transform = 'scale(1)';
        });
    });
}

// Animated Counter Function
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

window.addEventListener('scroll', animateOnScroll, { passive: true });

// Добавляем звуковые эффекты (опционально)
function playSound(type) {
    // Создаем простой звуковой эффект с помощью Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            break;
        case 'success':
            oscillator.frequency.value = 1200;
            gainNode.gain.value = 0.2;
            break;
        case 'hover':
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.05;
            break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Добавляем звуковые эффекты к кнопкам
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', () => playSound('hover'));
    button.addEventListener('click', () => playSound('click'));
});

// Функция для просмотра заявок (для админа)
function viewOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('Все заявки:', orders);
    
    // Загружаем заказы с сервера
    loadOrdersFromServer();
    
    return orders;
}

// Загрузка заказов с сервера
function loadOrdersFromServer() {
    fetch('/api/orders')
        .then(response => response.json())
        .then(orders => {
            console.log('=== ВСЕ ЗАКАЗЫ (с сервера) ===');
            if (orders.length === 0) {
                console.log('На сервере пока нет заказов');
            } else {
                orders.forEach((order, index) => {
                    console.log(`#${index + 1} Заказ ID: ${order.id}`);
                    console.log(`📅 Время: ${order.timestamp}`);
                    console.log(`👤 Имя: ${order.name}`);
                    console.log(`📞 Телефон: ${order.phone}`);
                    console.log(`📧 Email: ${order.email}`);
                    console.log(`📋 Проект: ${order.projectType}`);
                    console.log(`💰 Цена: ${order.price} ₽`);
                    console.log(`💳 Оплата: ${order.paymentMethod || 'Не указан'}`);
                    console.log(`📝 Описание: ${order.description}`);
                    console.log(`⚡ Срочность: ${order.urgency || 'Обычная'}`);
                    console.log(`---`);
                });
            }
            console.log(`Всего заказов: ${orders.length}`);
            console.log('==================');
        })
        .catch(error => {
            console.log('❌ Ошибка загрузки заказов с сервера:', error);
        });
}

// Добавляем горячие клавиши для управления
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key === 'O') {
        e.preventDefault();
        const orders = viewOrders();
        showNotification(`📊 Всего заявок: ${orders.length}. Проверьте консоль для деталей.`, 'info');
    }
    
    if (e.ctrlKey && e.altKey && e.key === 'R') {
        e.preventDefault();
        viewAllReviews();
    }
});

// Функция для переключения FAQ
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const faqAnswer = faqItem.querySelector('.faq-answer');
    const faqToggle = element.querySelector('.faq-toggle');
    
    // Закрываем все другие FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.maxHeight = '0';
            item.querySelector('.faq-toggle').textContent = '+';
        }
    });
    
    // Переключаем текущий FAQ
    faqItem.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
        faqToggle.textContent = '−';
    } else {
        faqAnswer.style.maxHeight = '0';
        faqToggle.textContent = '+';
    }
}

// Анти-засыпание для Render
function keepAlive() {
    // Отправляем запрос на health check каждые 5 минут
    setInterval(() => {
        fetch('/health.html')
            .then(() => console.log('✅ Health check passed'))
            .catch(() => console.log('⚠️ Health check failed'));
    }, 300000); // 5 минут
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Закрываем все ответы по умолчанию
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.maxHeight = '0';
    });
    
    // Запускаем анти-засыпание
    keepAlive();
    
    // Инициализация мобильного меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', window.toggleMobileMenu);
    }
    
    // Добавляем обработчики для закрытия меню при клике на ссылки
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', window.closeMobileMenu);
    });
    
    // Инициализация звёзд рейтинга
    const initialRating = document.getElementById('reviewRating').value;
    document.querySelectorAll('.star').forEach(s => {
        s.classList.remove('active');
    });
    
    for (let i = 1; i <= initialRating; i++) {
        const starElement = document.querySelector(`.star[data-rating="${i}"]`);
        if (starElement) {
            starElement.classList.add('active');
        }
    }
});

// Пошаговая форма заказа
let currentStep = 1;
const totalSteps = 3;

function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            // Отмечаем текущий шаг как завершенный
            document.getElementById(`step${currentStep}`).classList.add('completed');
            document.getElementById(`step${currentStep}`).classList.remove('active');
            
            currentStep++;
            
            // Активируем новый шаг
            document.getElementById(`step${currentStep}`).classList.add('active');
            
            // Показываем соответствующую форму
            showStep(currentStep);
            
            // Обновляем сводку на последнем шаге
            if (currentStep === 3) {
                updateOrderSummary();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Убираем активность с текущего шага
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        currentStep--;
        
        // Активируем предыдущий шаг
        document.getElementById(`step${currentStep}`).classList.add('active');
        document.getElementById(`step${currentStep}`).classList.remove('completed');
        
        // Показываем соответствующую форму
        showStep(currentStep);
    }
}

function showStep(step) {
    // Скрываем все шаги
    document.querySelectorAll('.form-step').forEach(formStep => {
        formStep.classList.remove('active');
    });
    
    // Показываем нужный шаг
    document.getElementById(`formStep${step}`).classList.add('active');
}

function validateStep(step) {
    let isValid = true;
    
    if (step === 1) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!name) {
            showNotification('⚠️ Пожалуйста, введите ваше имя', 'error');
            isValid = false;
        } else if (!email || !isValidEmail(email)) {
            showNotification('⚠️ Пожалуйста, введите корректный email', 'error');
            isValid = false;
        }
    } else if (step === 2) {
        const projectType = document.getElementById('projectType').value;
        const description = document.getElementById('description').value.trim();
        
        if (!projectType) {
            showNotification('⚠️ Пожалуйста, выберите тип проекта', 'error');
            isValid = false;
        } else if (!description) {
            showNotification('⚠️ Пожалуйста, опишите вашу идею', 'error');
            isValid = false;
        }
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function updateOrderSummary() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const projectType = document.getElementById('projectType').value;
    const projectName = document.getElementById('projectName').value;
    const description = document.getElementById('description').value;
    
    const projectTypeText = document.getElementById('projectType').options[document.getElementById('projectType').selectedIndex].text;
    
    const summaryHTML = `
        <div class="order-summary-item">
            <span class="order-summary-label">👤 Имя:</span>
            <span class="order-summary-value">${name}</span>
        </div>
        <div class="order-summary-item">
            <span class="order-summary-label">📧 Email:</span>
            <span class="order-summary-value">${email}</span>
        </div>
        ${phone ? `
        <div class="order-summary-item">
            <span class="order-summary-label">📱 Телефон:</span>
            <span class="order-summary-value">${phone}</span>
        </div>
        ` : ''}
        <div class="order-summary-item">
            <span class="order-summary-label">🎯 Тип проекта:</span>
            <span class="order-summary-value">${projectTypeText}</span>
        </div>
        ${projectName ? `
        <div class="order-summary-item">
            <span class="order-summary-label">📋 Название:</span>
            <span class="order-summary-value">${projectName}</span>
        </div>
        ` : ''}
        <div class="order-summary-item">
            <span class="order-summary-label">📝 Описание:</span>
            <span class="order-summary-value">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</span>
        </div>
    `;
    
    document.getElementById('orderSummaryContent').innerHTML = summaryHTML;
}

// Обработчик отправки формы
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (!validateStep(3)) {
        return;
    }
    
    const agreement = document.getElementById('agreement').checked;
    if (!agreement) {
        showNotification('⚠️ Пожалуйста, согласитесь с условиями обработки данных', 'error');
        return;
    }
    
    // Собираем данные формы
    const order = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        projectType: document.getElementById('projectType').value,
        projectName: document.getElementById('projectName').value,
        description: document.getElementById('description').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        timestamp: new Date().toISOString(),
        status: 'Новый'
    };
    
    // Сохраняем заказ
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Отправляем email
    sendOrderEmail(order);
    
    // Показываем уведомление
    showNotification('✅ Заявка успешно отправлена! Реквизиты для оплаты отправим на ваш email в течение 1 часа.', 'success');
    
    // Эффект конфетти
    function createConfetti() {
        const colors = ['#333333', '#666666', '#999999', '#000000', '#f8f9fa', '#e1e5e9'];
        const confettiCount = 50;
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            document.body.appendChild(confetti);
        }
        setTimeout(() => {
            document.querySelectorAll('.confetti').forEach(confetti => confetti.remove());
        }, 3000);
    }
    createConfetti();
    
    // Сбрасываем форму
    setTimeout(() => {
        document.getElementById('orderForm').reset();
        currentStep = 1;
        
        // Сбрасываем шаги
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        document.getElementById('step1').classList.add('active');
        
        showStep(1);
    }, 3000);
});

// Функция для одобрения отзыва
function approveReview(reviewId) {
    // Одобряем в localStorage
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const reviewIndex = reviews.findIndex(review => review.id == reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].approved = true;
        localStorage.setItem('reviews', JSON.stringify(reviews));
        loadReviews(); // Перезагружаем отображение
        showNotification('✅ Отзыв одобрен и опубликован!', 'success');
    }
    
    // Отправляем одобрение на сервер
    approveReviewOnServer(reviewId);
}

// Одобрение отзыва на сервере
function approveReviewOnServer(reviewId) {
    fetch(`/api/review/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Отзыв одобрен на сервере:', data.message);
            console.log(`📅 Время одобрения: ${data.review.approvedAt}`);
        } else {
            console.log('❌ Ошибка одобрения отзыва на сервере:', data.message);
        }
    })
    .catch(error => {
        console.log('❌ Ошибка соединения с сервером:', error);
    });
}

// Функция для просмотра всех отзывов (включая неодобренные)
function viewAllReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    console.log('=== ВСЕ ОТЗЫВЫ (localStorage) ===');
    reviews.forEach(review => {
        console.log(`ID: ${review.id}`);
        console.log(`Имя: ${review.name}`);
        console.log(`Email: ${review.email || 'Не указан'}`);
        console.log(`Проект: ${getProjectName(review.project)}`);
        console.log(`Оценка: ${'⭐'.repeat(review.rating)}`);
        console.log(`Текст: "${review.text}"`);
        console.log(`Дата: ${review.date}`);
        console.log(`Статус: ${review.approved ? '✅ Одобрен' : '⏳ Ожидает одобрения'}`);
        console.log(`---`);
        
        if (!review.approved) {
            console.log(`Для одобрения введите: approveReview(${review.id})`);
        }
    });
    console.log('==================');
    
    // Загружаем отзывы с сервера
    loadReviewsFromServer();
    
    showNotification(`📊 Всего отзывов: ${reviews.length}. Проверьте консоль для деталей.`, 'info');
}

// Загрузка отзывов с сервера
function loadReviewsFromServer() {
    fetch('/api/reviews')
        .then(response => response.json())
        .then(reviews => {
            console.log('=== ВСЕ ОТЗЫВЫ (с сервера) ===');
            if (reviews.length === 0) {
                console.log('На сервере пока нет отзывов');
            } else {
                reviews.forEach((review, index) => {
                    console.log(`#${index + 1} Отзыв ID: ${review.id}`);
                    console.log(`📅 Время сервера: ${review.timestamp}`);
                    console.log(`👤 Имя: ${review.name}`);
                    console.log(`📧 Email: ${review.email || 'Не указан'}`);
                    console.log(`📋 Проект: ${review.project || 'Не указан'}`);
                    console.log(`⭐ Оценка: ${'⭐'.repeat(review.rating)}`);
                    console.log(`📝 Текст: "${review.text}"`);
                    console.log(`✅ Публикация: ${review.permission ? 'Разрешено' : 'Запрещено'}`);
                    console.log(`---`);
                });
            }
            console.log(`Всего отзывов: ${reviews.length}`);
            console.log('==================');
        })
        .catch(error => {
            console.log('❌ Ошибка загрузки отзывов с сервера:', error);
        });
}

// Функция для отправки заказа на сервер
function sendOrderToServer(order) {
    fetch('/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Заказ успешно отправлен на сервер, ID:', data.id);
        } else {
            console.log('❌ Ошибка отправки заказа на сервер:', data.message);
        }
    })
    .catch(error => {
        console.log('❌ Ошибка соединения с сервером:', error);
    });
}

// Функция для отправки отзыва на сервер
function sendReviewToServer(review) {
    fetch('/api/review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Отзыв успешно отправлен на сервер, ID:', data.id);
        } else {
            console.log('❌ Ошибка отправки отзыва на сервер:', data.message);
        }
    })
    .catch(error => {
        console.log('❌ Ошибка соединения с сервером:', error);
    });
}
