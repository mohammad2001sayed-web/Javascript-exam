// src/js/home.js

export class HomeController {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async init() {
    const mealsGrid = document.getElementById("recipes-grid");
    const countText = document.getElementById("recipes-count");

    if (!mealsGrid) return;

    mealsGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fa-solid fa-circle-notch animate-spin text-3xl text-emerald-600 mb-2"></i>
        <p class="text-emerald-600 font-medium text-lg">
          Loading fresh recipes for you...
        </p>
      </div>
    `;

    const meals = await this.apiService.getInitialMeals();

    this.renderMeals(
      meals,
      `Showing ${meals.length} recipes`
    );
  }

  renderMeals(meals, countMessage) {
    const mealsGrid = document.getElementById("recipes-grid");
    const countText = document.getElementById("recipes-count");

    if (!mealsGrid) return;

    if (countText) {
      countText.textContent = countMessage;
    }

    if (!meals || meals.length === 0) {
      mealsGrid.innerHTML = `
        <p class="col-span-full text-center text-red-500 py-12">
          No recipes found!
        </p>
      `;
      return;
    }

    mealsGrid.innerHTML = meals
      .map(
        (meal) => `
        <div
          class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          data-meal-id="${meal.idMeal}"
        >
          <div class="relative h-48 overflow-hidden">
            <img
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="${meal.strMealThumb}"
              alt="${meal.strMeal}"
              loading="lazy"
            />
          </div>

          <div class="p-4">
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
              ${meal.strMeal}
            </h3>
          </div>
        </div>
      `
      )
      .join("");
  }
}