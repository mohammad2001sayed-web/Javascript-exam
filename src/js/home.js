// src/js/home.js
export class HomeController {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async init() {
    const mealsGrid = document.getElementById("recipes-grid");
    const countText = document.getElementById("recipes-count");
    if (!mealsGrid) return;

    // كلمة مؤقتة متناسقة مع التصميم لحين رجوع البيانات من الـ API
    mealsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fa-solid fa-circle-notch animate-spin text-3xl text-emerald-600 mb-2"></i>
                <p class="text-emerald-600 font-medium text-lg">Loading fresh recipes for you...</p>
            </div>
        `;

    const meals = await this.apiService.getInitialMeals();

    if (meals.length === 0) {
      mealsGrid.innerHTML = `<p class="col-span-full text-center text-red-500 py-12">No recipes found!</p>`;
      return;
    }

    if (countText) countText.textContent = `Showing ${meals.length} recipes`;

    // تنظيف الـ Grid بالكامل ورسم الـ 25 وجبة الحقيقية بنفس كود الـ HTML الأصلي بتاعك
    mealsGrid.innerHTML = meals
      .map(
        (meal) => `
            <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${meal.idMeal}">
              <div class="relative h-48 overflow-hidden">
                <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${meal.strCategory}</span>
                  <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${meal.strArea}</span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.strMeal}</h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">Delicious ${meal.strCategory} recipe from ${meal.strArea} cuisine.</p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${meal.strCategory}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${meal.strArea}
                  </span>
                </div>
              </div>
            </div>
        `,
      )
      .join("");
  }
}
