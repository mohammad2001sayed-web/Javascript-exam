// src/js/mealDetails.js

export class MealDetailsController {
  constructor(apiService) {
    this.apiService = apiService;
    this.detailsContainer = document.getElementById("meal-details");

    // المتغيرات الخاصة بالوجبة والحصص
    this.currentMealData = null;
    this.servings = 1;
  }

  init() {
    window.addEventListener("hashchange", () => this.handleRouting());
    this.handleRouting();
    this.addStaticEvents();
  }

  async handleRouting() {
    const hash = window.location.hash;

    if (hash.startsWith("#/meal-details") && hash.includes("?id=")) {
      const urlParams = new URLSearchParams(hash.split("?")[1]);
      const mealId = urlParams.get("id");

      if (mealId && this.detailsContainer) {
        const logBtn = document.getElementById("log-meal-btn");
        if (logBtn) logBtn.dataset.mealId = mealId;

        // جلب تفاصيل الأكلة من السيرفر
        const meal = await this.apiService.getMealDetailsById(mealId);
        if (meal) {
          this.updateMealDOM(meal);
        }
      }
    }
  }

  /**
   * دالة تحديث الـ DOM وفرش البيانات ديناميكياً
   */
  updateMealDOM(meal) {
    // 1. تحديث الصورة والعنوان
    const heroImg = this.detailsContainer.querySelector("img");
    const heroTitle = this.detailsContainer.querySelector("h1");

    if (heroImg) {
      heroImg.src = meal.strMealThumb;
      heroImg.alt = meal.strMeal;
    }
    if (heroTitle) heroTitle.textContent = meal.strMeal;

    // 2. تحديث الـ Badges (القسم والبلد والتاغ)
    const badgesContainer = this.detailsContainer.querySelector(
      ".flex.items-center.gap-3.mb-3",
    );
    if (badgesContainer) {
      let tagsHTML = `
        <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.strCategory}</span>
        <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.strArea}</span>
      `;
      if (meal.strTags) {
        meal.strTags.split(",").forEach((tag) => {
          tagsHTML += `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${tag.trim()}</span>`;
        });
      }
      badgesContainer.innerHTML = tagsHTML;
    }

    // 3. تجميع المكونات الحقيقية ورصها جوه الـ Grid
    const ingredientsContainer = this.detailsContainer.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-2.gap-3",
    );
    const ingredientsCountLabel = this.detailsContainer.querySelector(
      ".text-sm.font-normal.text-gray-500.ml-auto",
    );

    if (ingredientsContainer) {
      let ingredientsHTML = "";
      let count = 0;

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
          count++;
          ingredientsHTML += `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
              <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
              <span class="text-gray-700">
                <span class="font-medium text-gray-900">${measure ? measure.trim() : ""}</span> ${ingredient.trim()}
              </span>
            </div>
          `;
        }
      }
      ingredientsContainer.innerHTML = ingredientsHTML;
      if (ingredientsCountLabel)
        ingredientsCountLabel.textContent = `${count} items`;
    }

    // 4. تحديث خطوات التحضير (Instructions)
    const instructionsContainer =
      this.detailsContainer.querySelector(".space-y-4");
    if (instructionsContainer && meal.strInstructions) {
      const steps = meal.strInstructions
        .split(/\r?\n|\./)
        .filter((step) => step.trim().length > 5);

      instructionsContainer.innerHTML = steps
        .map(
          (step, index) => `
        <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            ${index + 1}
          </div>
          <p class="text-gray-700 leading-relaxed pt-2">
            ${step.trim()}.
          </p>
        </div>
      `,
        )
        .join("");
    }

    // 5. تحديث فيديو اليوتيوب
    const iframe = this.detailsContainer.querySelector("iframe");
    if (iframe) {
      if (meal.strYoutube) {
        const videoId = meal.strYoutube.split("v=")[1]?.split("&")[0];
        iframe.parentElement.classList.remove("hidden");
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
      } else {
        iframe.parentElement.classList.add("hidden");
      }
    }

    // 6. تحديث القيم الغذائية (Nutrition Facts)
    const category = meal.strCategory || "Chicken";
    const mealId = parseInt(meal.idMeal) || 52772;

    let calories = 350 + (mealId % 350);
    let protein =
      category === "Beef" || category === "Chicken" || category === "Lamb"
        ? 35 + (mealId % 25)
        : 10 + (mealId % 15);
    let carbs =
      category === "Dessert" || category === "Pasta"
        ? 60 + (mealId % 40)
        : 20 + (mealId % 30);
    let fat = category === "Dessert" ? 25 + (mealId % 15) : 5 + (mealId % 15);
    let fiber =
      category === "Vegetarian" || category === "Vegan"
        ? 8 + (mealId % 8)
        : 1 + (mealId % 5);
    let sugar = category === "Dessert" ? 25 + (mealId % 20) : 2 + (mealId % 8);

    let totalCalories = calories * 4;

    const heroCalSpan = this.detailsContainer.querySelector("#hero-calories");
    if (heroCalSpan) heroCalSpan.textContent = `${calories} cal/serving`;

    const mainCalText = this.detailsContainer.querySelector(
      ".text-4xl.font-bold.text-emerald-600",
    );
    const totalCalText = this.detailsContainer.querySelector(
      ".text-xs.text-gray-500.mt-1",
    );
    if (mainCalText) mainCalText.textContent = calories;
    if (totalCalText) totalCalText.textContent = `Total: ${totalCalories} cal`;

    const nutritionFactsContainer = document.getElementById(
      "nutrition-facts-container",
    );
    if (nutritionFactsContainer) {
      const rows =
        nutritionFactsContainer.querySelectorAll(".space-y-4 > .flex");
      const bars = nutritionFactsContainer.querySelectorAll(
        ".space-y-4 .w-full.bg-gray-100 div",
      );

      const itemsData = [
        { val: protein, max: 80 },
        { val: carbs, max: 300 },
        { val: fat, max: 100 },
        { val: fiber, max: 40 },
        { val: sugar, max: 50 },
      ];

      itemsData.forEach((item, idx) => {
        if (rows[idx]) {
          const valSpan = rows[idx].querySelector(".font-bold.text-gray-900");
          if (valSpan) valSpan.textContent = `${item.val}g`;
        }
        if (bars[idx]) {
          const pct = Math.min((item.val / item.max) * 100, 100);
          bars[idx].style.width = `${pct}%`;
        }
      });
    }

    // حفظ البيانات الحالية في الـ state الخاصة بالـ Controller
    this.currentMealData = {
      title: meal.strMeal,
      image: meal.strMealThumb,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
    };

    // ربط الزرار الأساسي والـ Popup إجبارياً مع كل عملية تحديث DOM لمنع الـ Bugs
    this.bindLogButton();
    this.setupModalEvents();
  }

  bindLogButton() {
    const mainLogBtn = document.getElementById("log-meal-btn");
    if (mainLogBtn) {
      mainLogBtn.onclick = () => this.openLogModal();
    }
  }

  openLogModal() {
    const modal = document.getElementById("log-meal-modal");
    if (!modal || !this.currentMealData) return;

    this.servings = 1;
    document.getElementById("servings-count").textContent = this.servings;
    document.getElementById("modal-meal-title").textContent =
      this.currentMealData.title;
    document.getElementById("modal-meal-image").src =
      this.currentMealData.image;

    this.updateModalNutrition();

    modal.classList.remove("hidden");
    setTimeout(() => modal.classList.add("opacity-100"), 10);
  }

  closeLogModal() {
    const modal = document.getElementById("log-meal-modal");
    if (!modal) return;
    modal.classList.remove("opacity-100");
    setTimeout(() => modal.classList.add("hidden"), 300);
  }

  updateModalNutrition() {
    if (!this.currentMealData) return;

    const modalCal = document.getElementById("modal-calc-calories");
    const modalProtein = document.getElementById("modal-calc-protein");
    const modalCarbs = document.getElementById("modal-calc-carbs");
    const modalFat = document.getElementById("modal-calc-fat");

    if (modalCal)
      modalCal.textContent = Math.round(
        this.currentMealData.calories * this.servings,
      );
    if (modalProtein)
      modalProtein.textContent = `${Math.round(this.currentMealData.protein * this.servings)}g`;
    if (modalCarbs)
      modalCarbs.textContent = `${Math.round(this.currentMealData.carbs * this.servings)}g`;
    if (modalFat)
      modalFat.textContent = `${Math.round(this.currentMealData.fat * this.servings)}g`;
  }

  setupModalEvents() {
    // ربط الأحداث مباشرة بـ onclick لضمان عدم تكرار الـ Event Listener عند إعادة الدخول للصفحة
    const btnIncrease = document.getElementById("btn-increase-servings");
    const btnDecrease = document.getElementById("btn-decrease-servings");
    const btnClose = document.getElementById("btn-close-modal");
    const btnConfirm = document.getElementById("btn-confirm-log");

    if (btnIncrease) {
      btnIncrease.onclick = () => {
        this.servings++;
        document.getElementById("servings-count").textContent = this.servings;
        this.updateModalNutrition();
      };
    }

    if (btnDecrease) {
      btnDecrease.onclick = () => {
        if (this.servings > 1) {
          this.servings--;
          document.getElementById("servings-count").textContent = this.servings;
          this.updateModalNutrition();
        }
      };
    }

    if (btnClose) btnClose.onclick = () => this.closeLogModal();

    if (btnConfirm) {
      btnConfirm.onclick = () => {
        const loggedMeal = {
          name: `${this.currentMealData.title} (${this.servings} serving${this.servings > 1 ? "s" : ""})`,
          calories: this.currentMealData.calories * this.servings,
          protein: this.currentMealData.protein * this.servings,
          carbs: this.currentMealData.carbs * this.servings,
          fat: this.currentMealData.fat * this.servings,
          image: this.currentMealData.image,
        };

        if (window.foodLogCtrl) {
          window.foodLogCtrl.addMeal(loggedMeal);
          this.closeLogModal();
          window.location.hash = "#/foodlog";
        }
      };
    }
  }

  addStaticEvents() {
    const backBtn = document.getElementById("back-to-meals-btn");
    if (backBtn) {
      backBtn.onclick = () => {
        window.location.hash = "#/home";
      };
    }
  }
}
