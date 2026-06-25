// src/js/categories.js

export class CategoriesController {
  constructor(apiService, homeController) {
    this.apiService = apiService;
    this.homeController = homeController;
    
    // مسك عناصر الـ HTML الخاصة بالأقسام، البلاد، والـ Input
    this.categoriesGrid = document.getElementById("categories-grid");
    this.cuisinesContainer = document.querySelector("#search-filters-section .flex");
    this.searchInput = document.getElementById("search-input");

    // المصفوفات الثابتة الخاصة بيك
    this.categories = [
      "Beef", "Chicken", "Dessert", "Lamb", "Miscellaneous", 
      "Pasta", "Pork", "Seafood", "Side", "Starter", "Vegan", "Vegetarian"
    ];

    this.cuisines = [
      "All Recipes", "Egyptian", "American", "British", "Canadian", 
      "Chinese", "French", "Indian", "Italian", "Japanese", 
      "Mexican", "Moroccan", "Spanish", "Thai", "Turkish"
    ];
  }

  init() {
    // تشغيل الرندر والأحداث أول ما الكلاس يشتغل في الـ main.js
    if (this.categoriesGrid) this.renderCategories();
    if (this.cuisinesContainer) this.renderCuisines();
    if (this.searchInput) this.addSearchEvent();
  }

  // 1️⃣ رندر الأقسام بكود الـ HTML بتاعك بالملي
  renderCategories() {
    this.categoriesGrid.innerHTML = "";
    const categoryIcons = {
      'Beef': 'fa-drumstick-bite', 'Chicken': 'fa-bacon', 'Dessert': 'fa-cake-candles',
      'Lamb': 'fa-cloud', 'Miscellaneous': 'fa-bowl-rice', 'Pasta': 'fa-wheat-awn',
      'Pork': 'fa-bacon', 'Seafood': 'fa-fish', 'Side': 'fa-bowl-food',
      'Starter': 'fa-utensils', 'Vegan': 'fa-leaf', 'Vegetarian': 'fa-seedling'
    };

    this.categories.forEach((category) => {
      const iconClass = categoryIcons[category] || 'fa-utensils';
      this.categoriesGrid.innerHTML += `
        <div class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group" data-category="${category}">
          <div class="flex items-center gap-2.5">
            <div class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <i class="fa-solid ${iconClass}"></i>
            </div>
            <div><h3 class="text-sm font-bold text-gray-900">${category}</h3></div>
          </div>
        </div>
      `;
    });
    this.addCategoryEvents();
  }

  addCategoryEvents() {
    const cards = document.querySelectorAll(".category-card");
    cards.forEach((card) => {
      card.addEventListener("click", async () => {
        const category = card.dataset.category;
        this.showLoading();
        const filteredMeals = await this.apiService.getMealsByCategory(category);
        this.homeController.renderMeals(filteredMeals, `Showing ${filteredMeals.length} ${category} recipes`, category);
      });
    });
  }

  // 2️⃣ رندر أزرار البلاد (Cuisines) مع التحكم في الزرار الأخضر النشط
  renderCuisines() {
    this.cuisinesContainer.innerHTML = "";

    this.cuisines.forEach((cuisine, index) => {
      const isActive = index === 0; // أول زرار "All Recipes" بيبدأ أخضر
      const btnClass = isActive 
        ? "cuisine-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all shadow-sm"
        : "cuisine-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all";

      this.cuisinesContainer.innerHTML += `
        <button class="${btnClass}" data-cuisine="${cuisine}">
          ${cuisine}
        </button>
      `;
    });

    this.addCuisineEvents();
  }

  addCuisineEvents() {
    const buttons = document.querySelectorAll(".cuisine-btn");

    buttons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const cuisine = btn.dataset.cuisine;
        
        // إعادة تعيين الألوان لكل الأزرار وتلوين الزرار الحالي بالأخضر
        buttons.forEach(b => {
          b.className = "cuisine-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all";
        });
        btn.className = "cuisine-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all shadow-sm";

        this.showLoading();

        if (cuisine === "All Recipes") {
          const meals = await this.apiService.getInitialMeals();
          this.homeController.renderMeals(meals, `Showing ${meals.length} recipes`, "All");
        } else {
          const filteredMeals = await this.apiService.getMealsByCuisine(cuisine);
          this.homeController.renderMeals(filteredMeals, `Showing ${filteredMeals.length} ${cuisine} recipes`, cuisine);
        }
      });
    });
  }

  // 3️⃣ ميزة البحث بالـ Input (تلقائي وحي أثناء الكتابة)
  addSearchEvent() {
    this.searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim(); // قراءة النص المكتوب وحذف الفراغات

      this.showLoading();

      // لو اليوزر مسح الكلام وخلى الـ Input فاضي، يعيد عرض الـ 25 وجبة الأساسية
      if (query === "") {
        const defaultMeals = await this.apiService.getInitialMeals();
        this.homeController.renderMeals(defaultMeals, `Showing ${defaultMeals.length} recipes`, "All");
        return;
      }

      // عمل طلب للـ API للبحث عن الأكلات بالاسم
      const searchResults = await this.apiService.searchMealsByName(query);

      // رندر الكروت بالنتائج الجديدة
      this.homeController.renderMeals(
        searchResults, 
        `Found ${searchResults.length} results for "${query}"`, 
        "Search"
      );
    });
  }

  // دالة تحميل مؤقتة تظهر في الـ Grid تحت أثناء جلب البيانات
  showLoading() {
    const mealsGrid = document.getElementById('recipes-grid');
    if (mealsGrid) {
      mealsGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
            <i class="fa-solid fa-circle-notch animate-spin text-3xl text-emerald-600 mb-2"></i>
            <p class="text-emerald-600 font-medium">Processing...</p>
        </div>
      `;
    }
  }
}