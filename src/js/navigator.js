// src/js/navigator.js
export class AppNavigator {
  constructor(routes) {
    this.routes = routes;

    // 1. اسمع لتغير الـ Hash في الـ URL (لما تدوس على اللينكات)
    window.addEventListener("hashchange", () => this.handleRoute());

    // 2. اسمع لأول ما الصفحة تعمل Load
    window.addEventListener("load", () => this.handleRoute());
  }

  handleRoute() {
    // جيب الـ Hash الحالي (مثلاً #/home أو #/products)
    let currentHash = window.location.hash;

    // لو الصفحة لسه فاتحة والـ Hash فاضي، خليه يروح لـ #/home تلقائياً
    if (!currentHash || currentHash === "#/" || currentHash === "") {
      window.location.hash = "#/home";
      return;
    }

    // جيب إعدادات السيكشن المقابل للـ Hash من الخريطة
    const targetRoute = this.routes[currentHash];

    if (targetRoute) {
      this.showSections(targetRoute);
      this.updateNavbarActiveState(currentHash);
    } else {
      // لو المسار مش مكتوب صح، حوله للهوم
      window.location.hash = "#/home";
    }
  }

  showSections(routeConfig) {
    // أسماء الـ IDs بتاعة الـ 6 سكاشن اللي عندك في الـ HTML بالظبط
    const allMainSections = [
      "search-filters-section",
      "meal-categories-section",
      "all-recipes-section",
      "meal-details",
      "products-section",
      "foodlog-section",
    ];

    // إخفاء كل السكاشن أولاً
    allMainSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });

    // إظهار السكاشن الخاصة بالصفحة الحالية فقط
    routeConfig.sectionsShow.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("hidden");
    });

    // تحديث نصوص الـ Header ديناميكياً
    const headerTitle = document.querySelector("#header h1");
    const headerSubtitle = document.querySelector("#header p");
    if (headerTitle && headerSubtitle) {
      headerTitle.textContent = routeConfig.title;
      headerSubtitle.textContent = routeConfig.subtitle;
    }
  }

  updateNavbarActiveState(activeHash) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (href === activeHash) {
        // تلوين اللينك النشط باللون الأخضر المميز بتاعك
        link.className =
          "nav-link flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg transition-all";
        const span = link.querySelector("span");
        if (span) {
          span.className = "font-semibold";
        }
      } else {
        // إرجاع اللينكات الباقية للشكل الرمادي الطبيعي
        link.className =
          "nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all";
        const span = link.querySelector("span");
        if (span) {
          span.className = "font-medium";
        }
      }
    });
  }
}
