/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

// =========================
// Elements
// =========================

// ==========================================
// 1. Router Class
// ==========================================
class Router {
    constructor(routes) {
        this.routes = routes;
        // Listeners لمراقبة أي تغيير في الـ URL (Hash)
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        // لو الـ URL فاضي خالص، افتح الـ home كـ Default
        const currentHash = window.location.hash || '#/home';
        const targetRoute = this.routes[currentHash];

        if (targetRoute) {
            this.showSections(targetRoute);
            this.updateNavbarActiveState(currentHash);
        } else {
            // لو اليوزر كتب لينك غلط أو مش موجود، رجعه للهوم
            window.location.hash = '#/home';
        }
    }

    showSections(routeConfig) {
        // 1. إخفاء كل السكاشن الرئيسية أولاً
        const allMainSections = [
            'search-filters-section',
            'meal-categories-section',
            'all-recipes-section',
            'meal-details',
            'products-section',
            'foodlog-section'
        ];
        
        allMainSections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden'); // استخدام كلاس hidden بتاع Tailwind
        });

        // 2. إظهار السكاشن الخاصة بالـ Route الحالي فقط
        routeConfig.sectionsShow.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('hidden');
        });

        // 3. تحديث عنوان الـ Header والـ Subtitle ديناميكياً بناءً على الصفحة
        const headerTitle = document.querySelector('#header h1');
        const headerSubtitle = document.querySelector('#header p');
        if (headerTitle && headerSubtitle) {
            headerTitle.textContent = routeConfig.title;
            headerSubtitle.textContent = routeConfig.subtitle;
        }
    }

    updateNavbarActiveState(currentHash) {
        // تحديث كلاسات الـ Active في أزرار الـ Sidebar
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentHash) {
                // شكل الزرار النشط (Active)
                link.className = "nav-link flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg transition-all";
                link.querySelector('span').className = "font-semibold";
            } else {
                // شكل الزرار العادي
                link.className = "nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all";
                link.querySelector('span').className = "font-medium";
            }
        }
        );
    }
}

// ==========================================
// 2. App Controller Class (المايسترو)
// ==========================================
class App {
    constructor() {
        this.initRouter();
        this.initLoadingOverlay();
    }

    initRouter() {
        // هنا بنحدد كل Hash هيظهر سكاشن إيه بالظبط من الـ HTML بتاعك
        const routesConfig = {
            '#/home': {
                sectionsShow: ['search-filters-section', 'meal-categories-section', 'all-recipes-section'],
                title: 'Meals & Recipes',
                subtitle: 'Discover delicious and nutritious recipes tailored for you'
            },
            '#/meal-details': {
                sectionsShow: ['meal-details'],
                title: 'Recipe Details',
                subtitle: 'View preparation steps and nutritional facts'
            },
            '#/scanner': {
                sectionsShow: ['products-section'],
                title: 'Product Scanner',
                subtitle: 'Search for packaged food products to view nutrition information'
            },
            '#/food-log': {
                sectionsShow: ['foodlog-section'],
                title: 'Daily Food Log',
                subtitle: 'Track and monitor your daily nutrition intake'
            }
        };

        // تشغيل الـ Router
        this.router = new Router(routesConfig);
    }

    initLoadingOverlay() {
        // إخفاء الـ Loading بعد ما الصفحة تحمل بالكامل
        const overlay = document.getElementById('app-loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('opacity-0');
                setTimeout(() => overlay.remove(), 500);
            }, 1000);
        }
    }
}

// تشغيل الـ Application
const app = new App();