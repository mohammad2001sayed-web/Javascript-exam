/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

// ==========================================
// 1. Router Class
// ==========================================

import { APIService } from "./api.js";
import { AppNavigator } from "./navigator.js";
import { HomeController } from "./home.js";
import { CategoriesController } from "./categories.js";

class App {
  constructor() {
    this.apiService = new APIService();
    this.homeController = new HomeController(this.apiService);

    // ✨ التعديل هنا: تشغيل الكلاس بتاع الـ Categories وتمرير الاعتمادات له
    this.categoriesController = new CategoriesController(this.apiService, this.homeController);
    this.categoriesController.init();

    this.initRouter();
    this.initLoadingOverlay();

    // تشغيل الـ Home وتجيب الوجبات الابتدائية
    this.homeController.init();
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
      "#/products": {
        sectionsShow: ["products-section"],
        title: "Product Scanner",
        subtitle:
          "Search for packaged food products to view nutrition information",
      },
      "#/foodlog": {
        sectionsShow: ["foodlog-section"],
        title: "Daily Food Log",
        subtitle: "Track and monitor your daily nutrition intake",
      },
    };

    this.navigator = new AppNavigator(routesConfig);
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