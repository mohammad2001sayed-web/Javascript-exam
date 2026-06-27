/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

// ==========================================
// 1. Router Class
// ==========================================

// src/js/main.js

import { APIService } from "./api.js";
import { AppNavigator } from "./navigator.js";
import { HomeController } from "./home.js";
import { CategoriesController } from "./categories.js";
import { MealDetailsController } from "./mealDetails.js"; 
import { ScannerController } from "./scanner.js";
import { FoodLogController } from "./foodLog.js"; 

class App {
  constructor() {
    // 1. إنشاء الـ APIService أولاً لأنه الأساس اللي الكل بيعتمد عليه
    this.apiService = new APIService();
    
    // 2. إنشاء الـ Controllers وتمرير الاعتمادات المتبادلة بينهم
    this.homeController = new HomeController(this.apiService);
    this.categoriesController = new CategoriesController(this.apiService, this.homeController);
    this.mealDetailsController = new MealDetailsController(this.apiService);
    
    // إنشاء الـ Controllers الجديدة الخاصة بالـ Scanner والـ Food Log جوه الكلاس
    this.scannerController = new ScannerController();
    this.foodLogController = new FoodLogController();

    // 3. تشغيل الـ Routers والـ Loading
    this.initRouter();
    this.initLoadingOverlay();

    // 4. عمل Init وتشغيل لكل كلاس ليقوم بوظيفته فوراً
    this.homeController.init();
    this.categoriesController.init();
    this.mealDetailsController.init();
    
    // تشغيل الـ Controllers الجديدة فوراً مع بداية التطبيق
    this.scannerController.init();
    this.foodLogController.init();

    // رفع الـ Food Log على الـ window عشان الـ Scanner أو الـ Recipes يقدروا يضيفوا أكلات بسهولة
    window.foodLogCtrl = this.foodLogController;

    // 5. مراقبة تغيير الصفحة عشان نعمل الأكتيف على اللينكات تلقائياً
    window.addEventListener("hashchange", () => this.updateActiveNavbarLink());
    this.updateActiveNavbarLink(); // تشغيل فوري أول ما الصفحة تفتح
  }

  initRouter() {
    const routesConfig = {
      "#/home": {
        sectionsShow: [
          "search-filters-section",
          "meal-categories-section",
          "all-recipes-section",
        ],
        title: "Meals & Recipes",
        subtitle: "Discover delicious and nutritious recipes tailored for you",
      },
      "#/meal-details": {
        sectionsShow: ["meal-details"],
        title: "Recipe Details",
        subtitle: "View preparation steps and nutritional facts",
      },
      // 🎯 دعم الكلمتين عشان لو الـ Navbar عندك مكتوب فيه scanner أو products يشتغل في الحالتين وميعلقش!
      "#/scanner": {
        sectionsShow: ["products-section"],
        title: "Product Scanner",
        subtitle: "Search for packaged food products to view nutrition information",
      },
      "#/products": {
        sectionsShow: ["products-section"],
        title: "Product Scanner",
        subtitle: "Search for packaged food products to view nutrition information",
      },
      "#/foodlog": {
        sectionsShow: ["foodlog-section"],
        title: "Daily Food Log",
        subtitle: "Track and monitor your daily nutrition intake",
      },
    };

    this.navigator = new AppNavigator(routesConfig);
  }

  // دالة تحديث الـ Active Class على لينكات الـ Navbar بناءً على الـ Hash الحالي
  updateActiveNavbarLink() {
    const currentHash = window.location.hash || "#/home";
    const navLinks = document.querySelectorAll("nav a, .nav-link");
    
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      
      // حركة ذكية: لو الـ Hash الحالي هو #/products أو #/scanner واللينك رايح لأي منهم، اعتبره Active
      const isScannerActive = (currentHash === "#/scanner" || currentHash === "#/products") && (href === "#/scanner" || href === "#/products");
      
      if (href === currentHash || isScannerActive) {
        link.classList.add("active", "text-emerald-600", "font-bold");
        link.classList.remove("text-gray-600");
      } else {
        link.classList.remove("active", "text-emerald-600", "font-bold");
        link.classList.add("text-gray-600");
      }
    });
  }

  initLoadingOverlay() {
    const overlay = document.getElementById("app-loading-overlay");

    if (overlay) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          overlay.classList.add("opacity-0", "pointer-events-none");
          setTimeout(() => {
            overlay.remove();
          }, 500);
        }, 1000); 
      });
    }
  }
}

// تشغيل الأبليكيشن بالكامل فوراً
const app = new App();