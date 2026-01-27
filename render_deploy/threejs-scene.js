// Профессиональная 3D сцена для Образовательного Хаба с оптимизацией
class ThreeJSScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometries = [];
        this.textMeshes = [];
        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.sections = [];
        this.lastFrameTime = 0;
        this.frameThrottle = 16; // ~60fps
        this.cachedValues = {};
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createParticles();
        this.createGeometries();
        this.create3DText();
        this.createEventListeners();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0xf8f8f8, 0.0008);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
        this.camera.position.y = 10;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('threejs-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    createLights() {
        // Минималистичный окружающий свет
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);

        // Нейтральный точечный свет 1
        this.pointLight1 = new THREE.PointLight(0xffffff, 0.8, 100);
        this.pointLight1.position.set(30, 30, 30);
        this.pointLight1.castShadow = true;
        this.scene.add(this.pointLight1);

        // Нейтральный точечный свет 2
        this.pointLight2 = new THREE.PointLight(0xffffff, 0.8, 100);
        this.pointLight2.position.set(-30, 30, -30);
        this.pointLight2.castShadow = true;
        this.scene.add(this.pointLight2);

        // Направленный свет
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        this.directionalLight.position.set(0, 50, 50);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);

        // Минималистичный динамический свет
        this.dynamicLight = new THREE.PointLight(0xcccccc, 0.3, 150);
        this.dynamicLight.position.set(0, 0, 0);
        this.scene.add(this.dynamicLight);
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200; // Резко уменьшаем до 200
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50; // Еще меньше область
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1, // Минимальный размер
            color: 0xcccccc,
            transparent: true,
            opacity: 0.15, // Почти прозрачные
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particlesMesh);
        this.particles.push(particlesMesh);
    }

    create3DText() {
        // Уменьшаем количество слов для производительности
        const words = [
            { text: 'INNOVATION', position: [-20, 15, -15], rotation: [0, 0, 0] },
            { text: 'EXCELLENCE', position: [20, 10, -20], rotation: [0, Math.PI / 6, 0] },
            { text: 'SUCCESS', position: [0, -10, -25], rotation: [0, -Math.PI / 8, 0] }
        ];

        const loader = new THREE.FontLoader();
        
        // Создаем текст с использованием встроенного шрифта
        words.forEach((wordData, index) => {
            const textGeometry = new THREE.BoxGeometry(
                wordData.text.length * 1.5, // Уменьшаем размер
                2,
                0.8
            );
            
            const textMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                emissive: 0x000000,
                shininess: 100,
                specular: 0x111111,
                transparent: true,
                opacity: 0.6 // Уменьшаем непрозрачность
            });
            
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(...wordData.position);
            textMesh.rotation.set(...wordData.rotation);
            textMesh.castShadow = true;
            textMesh.receiveShadow = true;
            
            // Добавляем пользовательские данные для анимации
            textMesh.userData = {
                word: wordData.text,
                basePosition: { ...wordData.position },
                baseRotation: { ...wordData.rotation },
                animationSpeed: 0.0005 + index * 0.0001, // Уменьшаем скорость
                floatSpeed: 0.001 + index * 0.0001,
                rotationSpeed: {
                    x: 0.0005 + Math.random() * 0.001,
                    y: 0.001 + Math.random() * 0.001,
                    z: 0.0005 + Math.random() * 0.001
                }
            };
            
            this.scene.add(textMesh);
            this.textMeshes.push(textMesh);
        });
    }

    createGeometries() {
        // Минималистичная сфера (упрощенная)
        const sphereGeometry = new THREE.SphereGeometry(6, 16, 16); // Упрощаем геометрию
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0xf0f0f0,
            emissive: 0xffffff,
            shininess: 5,
            specular: 0xffffff,
            transparent: true,
            opacity: 0.2,
            wireframe: false
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, -25);
        sphere.castShadow = true;
        this.scene.add(sphere);
        this.geometries.push({ mesh: sphere, rotationSpeed: { x: 0.001, y: 0.0015, z: 0.0005 } });

        // Минималистичный тор (упрощенный)
        const torusGeometry = new THREE.TorusGeometry(8, 0.3, 8, 50); // Упрощаем геометрию
        const torusMaterial = new THREE.MeshPhongMaterial({
            color: 0xe0e0e0,
            emissive: 0xffffff,
            shininess: 5,
            specular: 0xffffff,
            transparent: true,
            opacity: 0.15,
            wireframe: false
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(0, 0, -35);
        torus.castShadow = true;
        this.scene.add(torus);
        this.geometries.push({ mesh: torus, rotationSpeed: { x: 0.0005, y: 0.001, z: 0.0005 } });
    }

    createEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        // Оптимизированный скролл с пассивным слушателем
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.detectSections();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onScroll() {
        this.targetScrollY = window.pageYOffset;
    }

    detectSections() {
        this.sections = [
            { element: document.querySelector('.hero'), name: 'hero' },
            { element: document.querySelector('.features'), name: 'features' },
            { element: document.querySelector('.projects'), name: 'projects' },
            { element: document.querySelector('.calculator'), name: 'calculator' },
            { element: document.querySelector('footer'), name: 'footer' }
        ].filter(section => section.element);
    }

    getScrollProgress() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        return this.scrollY / maxScroll;
    }

    getActiveSection() {
        for (let section of this.sections) {
            const rect = section.element.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
                return section.name;
            }
        }
        return 'hero';
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Агрессивная оптимизация частоты кадров
        const now = performance.now();
        if (now - this.lastFrameTime < 33) { // ~30fps для максимальной производительности
            return;
        }
        this.lastFrameTime = now;

        // Плавная прокрутка
        this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;
        const scrollProgress = this.getScrollProgress();
        const activeSection = this.getActiveSection();
        
        // Кэширование вычислений
        const time = Date.now();
        const scrollY = this.scrollY;

        // Минимальная анимация 3D текста
        this.textMeshes.forEach((textMesh, index) => {
            const userData = textMesh.userData;
            
            // Только базовое вращение
            textMesh.rotation.x += userData.rotationSpeed.x;
            textMesh.rotation.y += userData.rotationSpeed.y;
            
            // Минимальная scroll-зависимая анимация
            switch(activeSection) {
                case 'hero':
                    textMesh.position.y = userData.basePosition[1] + Math.sin(time * userData.floatSpeed) * 1.5;
                    textMesh.material.opacity = 0.3 + scrollProgress * 0.3;
                    break;
                    
                case 'features':
                    textMesh.position.y = userData.basePosition[1] + Math.sin(scrollY * 0.005 + index) * 2;
                    textMesh.material.opacity = 0.5;
                    break;
                    
                default:
                    textMesh.material.opacity = 0.2;
            }
        });

        // Минимальная анимация частиц
        this.particles.forEach((particle, index) => {
            particle.rotation.y += 0.0002 + scrollProgress * 0.0005;
            particle.position.y = Math.sin(scrollY * 0.0005 + index) * 0.8;
        });
        
        // Минимальная анимация геометрий
        this.geometries.forEach((geo, index) => {
            const baseRotation = geo.rotationSpeed;
            
            // Только базовое вращение
            geo.mesh.rotation.x += baseRotation.x;
            geo.mesh.rotation.y += baseRotation.y;

            // Минимальное scroll-позиционирование
            switch(activeSection) {
                case 'hero':
                    geo.mesh.scale.setScalar(1 + scrollProgress * 0.2);
                    break;
                case 'features':
                    geo.mesh.position.y = Math.sin(scrollY * 0.005 + index) * 2;
                    geo.mesh.scale.setScalar(1.1);
                    break;
                default:
                    geo.mesh.scale.setScalar(1);
            }
        });

        // Минимальная камера
        this.camera.position.z = 50 + Math.sin(scrollProgress * Math.PI) * 10;
        this.camera.position.y = 10 + Math.sin(scrollProgress * Math.PI * 2) * 2;

        // Минимальное освещение
        this.updateDynamicLighting(scrollProgress, activeSection);

        // Минимальная интерактивность с мышью
        const mouseInfluence = Math.max(0.5, 1 - scrollProgress * 0.7);
        this.camera.position.x += (this.mouse.x * 2 * mouseInfluence - this.camera.position.x) * 0.03;
        this.camera.position.y += ((this.mouse.y * 2 + 10) * mouseInfluence - this.camera.position.y) * 0.03;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    updateDynamicLighting(scrollProgress, activeSection) {
        // Минималистичное освещение
        this.dynamicLight.color.setHex(0xcccccc);
        this.dynamicLight.intensity = 0.2 + scrollProgress * 0.1;
        this.dynamicLight.position.set(
            Math.sin(Date.now() * 0.0005) * 20,
            Math.cos(Date.now() * 0.0005) * 10,
            30
        );

        // Минимальная анимация источников света
        this.pointLight1.position.x = 30 + Math.sin(Date.now() * 0.0003) * 5;
        this.pointLight1.position.z = 30 + Math.cos(Date.now() * 0.0003) * 5;
        
        this.pointLight2.position.x = -30 + Math.cos(Date.now() * 0.0003) * 5;
        this.pointLight2.position.z = -30 + Math.sin(Date.now() * 0.0003) * 5;

        // Стабильная интенсивность окружающего света
        this.ambientLight.intensity = 0.6;
    }
}

// Инициализация сцены при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ThreeJSScene();
});
