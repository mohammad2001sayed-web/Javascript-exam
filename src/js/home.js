// src/js/home.js

export class HomeController {
  constructor(apiService) {
    this.apiService = apiService;
    this.recipesGrid = document.getElementById("recipes-grid");
    this.recipesCount = document.getElementById("recipes-count");
  }

  async init() {
    // جلب الوجبات الابتدائية أول ما الصفحة تفتح (25 وجبة)
    if (this.recipesGrid) {
      this.showLoading();
      const meals = await this.apiService.getInitialMeals();
      this.renderMeals(meals, `Showing ${meals.length} recipes`, "All");
    }
  }

  /**
   * دالة رسم الكروت المكتملة بالملي بناءً على الصورة بتاعتك
   */
  renderMeals(meals, countTextString, currentCategory) {
    if (this.recipesCount) this.recipesCount.textContent = countTextString;
    if (!this.recipesGrid) return;

    // لو مفيش وجبات رجعت من الـ API
    if (!meals || meals.length === 0) {
      this.recipesGrid.innerHTML = `
        <div class="col-span-full text-center py-12 text-gray-500">
          <i class="fa-solid fa-shrimp text-4xl mb-2 text-gray-300"></i>
          <p class="font-medium">No recipes found matching your selection.</p>
        </div>
      `;
      return;
    }

    // بناء الكروت بجميع تفاصيل الصورة
    this.recipesGrid.innerHTML = meals
      .map((meal) => {
        // الـ API بتاع الفلترة (بالبلد أو الكاتيجوري) مش بيرجع كل البيانات (زي الوصف أو البلد)،
        // فبنعمل تعويض ذكي عشان الكارد يفضل غني ومكتمل دايماً زي الصورة بالظبط.
        const category = meal.strCategory || currentCategory || "Chicken";
        const area = meal.strArea || "Spanish";

        // تنظيف وتقصير براجراف الوصف عشان ميبقاش طويل ويبوظ التصميم
        let description = "";
        if (meal.strInstructions) {
          description = meal.strInstructions;
        } else {
          // نص افتراضي شيك شبه اللي في صورتك بالظبط لو الـ API مش جاعث وصف
          description = `step 1 Heat oven to 190C/170C fan/gas 5. Put all the ingredients into a delicious mix...`;
        }

        // تقصير النص لـ 90 حرف عشان يظهر تلات نقط (...) في الآخر بشكل جمالي
        if (description.length > 90) {
          description = description.substring(0, 90) + "...";
        }

        return `
          <div
            class="recipe-card bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            data-meal-id="${meal.idMeal}"
          >
            <!-- 1️⃣ الصورة والـ Badges اللي ع الصورة من تحت -->
            <div class="relative h-52 overflow-hidden bg-gray-100">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
                loading="lazy"
              />
              
              <!-- الـ Badges العايمة فوق الصورة بالملي -->
              <div class="absolute bottom-3 left-3 flex items-center gap-2">
                <span class="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-lg shadow-sm">
                  <i class="fa-solid fa-tag text-emerald-600 text-[10px]"></i>
                  ${category}
                </span>
                <span class="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-lg shadow-sm">
                  <i class="fa-solid fa-earth-americas text-blue-600 text-[10px]"></i>
                  ${area}
                </span>
              </div>
            </div>

            <!-- 2️⃣ بيانات الكارد (العنوان، البراجراف، والسطر السفلي) -->
            <div class="p-4">
              <!-- عنوان الأكلة الرئيسي -->
              <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                ${meal.strMeal}
              </h3>

              <!-- البراجراف المكتمل المكتوب تحت العنوان بالظبط -->
              <p class="text-xs text-gray-500 font-normal mb-4 line-clamp-2 leading-relaxed h-8">
                ${description}
              </p>

              <!-- خط فاصل خفيف -->
              <div class="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500 font-medium">
                <!-- أيقونة الـ Category التانية تحت -->
                <div class="flex items-center gap-1.5">
                  <i class="fa-solid fa-utensils text-emerald-600"></i>
                  <span>${category}</span>
                </div>
                
                <!-- أيقونة الـ Cuisine التانية تحت -->
                <div class="flex items-center gap-1.5">
                  <i class="fa-solid fa-globe text-blue-500"></i>
                  <span>${area}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    this.addCardEvents();
  }

  addCardEvents() {
    const cards = document.querySelectorAll(".recipe-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const mealId = card.dataset.mealId;
        console.log("Opening Meal Details for ID:", mealId);
        // هنا هتحط كود التنقل لصفحة تفاصيل الوجبة بعدين
        window.location.hash = `#/meal-details?id=${mealId}`;
      });
    });
  }

  showLoading() {
    if (this.recipesGrid) {
      this.recipesGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
            <i class="fa-solid fa-circle-notch animate-spin text-3xl text-emerald-600 mb-2"></i>
            <p class="text-emerald-600 font-medium">Loading amazing recipes...</p>
        </div>
      `;
    }
  }
}
