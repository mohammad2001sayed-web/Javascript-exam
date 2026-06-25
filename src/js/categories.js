export class CategoriesController {
  // بنمرر هنا الـ apiService والـ homeController عشان نستخدمهم عند الضغط
  constructor(apiService, homeController) {
    this.apiService = apiService;
    this.homeController = homeController;
    this.categoriesGrid = document.getElementById("categories-grid");

    this.categories = [
      "Beef",
      "Chicken",
      "Dessert",
      "Lamb",
      "Miscellaneous",
      "Pasta",
      "Pork",
      "Seafood",
      "Side",
      "Starter",
      "Vegan",
      "Vegetarian",
    ];
  }

  init() {
    if (this.categoriesGrid) {
      this.renderCategories();
    }
  }

  renderCategories() {
    this.categoriesGrid.innerHTML = "";

    // خريطة ذكية لتغيير الأيقونة فقط حسب الاسم، مع الحفاظ على كود الـ HTML بتاعك بالملي
    const categoryIcons = {
      'Beef': 'fa-drumstick-bite',
      'Chicken': 'fa-bacon',
      'Dessert': 'fa-cake-candles',
      'Lamb': 'fa-cloud',
      'Miscellaneous': 'fa-bowl-rice',
      'Pasta': 'fa-wheat-awn',
      'Pork': 'fa-bacon',
      'Seafood': 'fa-fish',
      'Side': 'fa-bowl-food',
      'Starter': 'fa-utensils',
      'Vegan': 'fa-leaf',
      'Vegetarian': 'fa-seedling'
    };

    this.categories.forEach((category) => {
      const iconClass = categoryIcons[category] || 'fa-utensils';

      // الكود بتاعك بالملي مع إضافة الأيقونة الديناميكية المتغيرة
      this.categoriesGrid.innerHTML += `
        <div
          class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
          data-category="${category}"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
            >
              <i class="fa-solid ${iconClass}"></i>
            </div>

            <div>
              <h3 class="text-sm font-bold text-gray-900">
                ${category}
              </h3>
            </div>
          </div>
        </div>
      `;
    });

    this.addEvents();
  }

  addEvents() {
    const cards = document.querySelectorAll(".category-card");
    const mealsGrid = document.getElementById('recipes-grid');

    cards.forEach((card) => {
      card.addEventListener("click", async () => {
        const category = card.dataset.category;
        console.log("Selected Category:", category);

        // 1. إظهار مؤشر تحميل مكان الأكلات لحد ما الـ API يرد
        if (mealsGrid) {
          mealsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fa-solid fa-circle-notch animate-spin text-3xl text-emerald-600 mb-2"></i>
                <p class="text-emerald-600 font-medium">Fetching ${category} recipes...</p>
            </div>
          `;
        }

        // 2. جلب الأكلات الخاصة بالكاتيجوري من الـ API
        const filteredMeals = await this.apiService.getMealsByCategory(category);

        // 3. تشغيل دالة الرسم الموجودة في الـ HomeController لتحديث الـ Grid والعداد بالملي
        this.homeController.renderMeals(
          filteredMeals, 
          `Showing ${filteredMeals.length} ${category} recipes`, 
          category
        );
      });
    });
  }
}