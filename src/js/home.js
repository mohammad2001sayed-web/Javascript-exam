// src/js/home.js

export class HomeController {
  constructor(apiService) {
    this.apiService = apiService;
    this.recipesGrid = document.getElementById("recipes-grid");
    this.recipesCount = document.getElementById("recipes-count");
    
    // 🎯 تمسيك أزرار الـ View Toggle من الـ HTML الحقيقي بتاعك
    this.gridViewBtn = document.getElementById("grid-view-btn");
    this.listViewBtn = document.getElementById("list-view-btn");
  }

  async init() {
    // جلب الوجبات الابتدائية أول ما الصفحة تفتح (25 وجبة)
    if (this.recipesGrid) {
      this.showLoading();
      const meals = await this.apiService.getInitialMeals();
      this.renderMeals(meals, `Showing ${meals.length} recipes`, "All");
      
      // ✨ تشغيل ميزة التبديل بين الـ Grid والـ List
      this.initViewToggle();
    }
  }

  /**
   * دالة التحكم في شكل العرض وتبديل الكلاسات والألوان للأزرار
   */
  initViewToggle() {
    if (!this.gridViewBtn || !this.listViewBtn || !this.recipesGrid) return;

    // 1️⃣ عند الضغط على زرار الـ List View (يعرض كاردين كبار في السطر)
    this.listViewBtn.addEventListener("click", () => {
      // تغيير كلاسات الـ Grid عشان يفرش الكروت
      this.recipesGrid.classList.remove("sm:grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4");
      this.recipesGrid.classList.add("grid-cols-1", "md:grid-cols-2", "max-w-5xl", "mx-auto");

      // إضاءة زرار الـ List (خلفية بيضاء وضل خفيف)
      this.listViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
      this.listViewBtn.querySelector("i").classList.remove("text-gray-500");
      this.listViewBtn.querySelector("i").classList.add("text-gray-700");

      // إطفاء زرار الـ Grid (إزالة الخلفية والضل)
      this.gridViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
      this.gridViewBtn.querySelector("i").classList.remove("text-gray-700");
      this.gridViewBtn.querySelector("i").classList.add("text-gray-500");
    });

    // 2️⃣ عند الضغط على زرار الـ Grid View (يرجعهم 4 كروت في السطر)
    this.gridViewBtn.addEventListener("click", () => {
      // إرجاع كلاسات الـ 4 كروت الأصلية للتيلويند
      this.recipesGrid.classList.remove("grid-cols-1", "md:grid-cols-2", "max-w-5xl", "mx-auto");
      this.recipesGrid.classList.add("grid-cols-1", "sm:grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4");

      // إضاءة زرار الـ Grid (خلفية بيضاء وضل خفيف)
      this.gridViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
      this.gridViewBtn.querySelector("i").classList.remove("text-gray-500");
      this.gridViewBtn.querySelector("i").classList.add("text-gray-700");

      // إطفاء زرار الـ List
      this.listViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
      this.listViewBtn.querySelector("i").classList.remove("text-gray-700");
      this.listViewBtn.querySelector("i").classList.add("text-gray-500");
    });
  }

  /**
   * دالة رسم الكروت المكتملة بناءً على الداتا القادمة من الـ API
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

    // بناء الكروت بجميع التفاصيل والـ Badges
    this.recipesGrid.innerHTML = meals
      .map((meal) => {
        const category = meal.strCategory || currentCategory || "Chicken";
        const area = meal.strArea || "Spanish";
        
        let description = "";
        if (meal.strInstructions) {
          description = meal.strInstructions;
        } else {
          description = `step 1 Heat oven to 190C/170C fan/gas 5. Put all the ingredients into a delicious mix...`;
        }

        if (description.length > 90) {
          description = description.substring(0, 90) + "...";
        }

        return `
          <div
            class="recipe-card bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            data-meal-id="${meal.idMeal}"
          >
            <div class="relative h-52 overflow-hidden bg-gray-100">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
                loading="lazy"
              />
              
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

            <div class="p-4">
              <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                ${meal.strMeal}
              </h3>

              <p class="text-xs text-gray-500 font-normal mb-4 line-clamp-2 leading-relaxed h-8">
                ${description}
              </p>

              <div class="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500 font-medium">
                <div class="flex items-center gap-1.5">
                  <i class="fa-solid fa-utensils text-emerald-600"></i>
                  <span>${category}</span>
                </div>
                
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

  /**
   * دالة التنقل لصفحة التفاصيل عند الضغط على الكارد (محدثة لحل مشكلة الـ Click)
   */
  addCardEvents() {
    const cards = document.querySelectorAll(".recipe-card");
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        // ✨ .closest بتضمن إن الـ Click يقرا الكارد الكبير أياً كانت الحتة اللي دوست عليها
        const currentCard = e.target.closest(".recipe-card");
        if (!currentCard) return;

        const mealId = currentCard.dataset.mealId;
        console.log("Opening Meal Details for ID:", mealId);
        
        // تحويل الـ Hash لصفحة التفاصيل وتمرير الـ ID
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