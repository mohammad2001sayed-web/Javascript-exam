// src/js/navigator.js

export class AppNavigator {
  constructor(routes) {
    this.routes = routes;
    this.allSections = this.extractAllSections();
    
    // الاستماع لأي تغيير في الـ Hash (لما اللينك يتغير فوق)
    window.addEventListener("hashchange", () => this.handleRoute());
    
    // تشغيل الـ Route أول ما الموقع يفتح لأول مرة
    this.handleRoute();
  }

  extractAllSections() {
    const sections = new Set();
    for (const route in this.routes) {
      this.routes[route].sectionsShow.forEach((section) => sections.add(section));
    }
    return Array.from(sections);
  }

  handleRoute() {
    let hash = window.location.hash || "#/home";

    // لو اللينك فيه علامة استفهام (بتاعت الـ ID) بنشيلها عشان الـ Routing يطابق صح
    if (hash.includes("?")) {
      hash = hash.split("?")[0]; 
    }

    const currentRoute = this.routes[hash];
    
    if (!currentRoute) {
      window.location.hash = "#/home";
      return;
    }

    // 1️⃣ ✨ الحتة السحرية: تحديث الـ Active Link في الناف بار دايماً
    this.updateActiveNavbarLink(hash);

    // 2️⃣ إخفاء وإظهار السيكشنز بناءً على الصفحة الحالية
    this.allSections.forEach((sectionId) => {
      const sectionElement = document.getElementById(sectionId);
      
      if (sectionElement) {
        if (currentRoute.sectionsShow.includes(sectionId)) {
          sectionElement.classList.remove("hidden");
        } else {
          sectionElement.classList.add("hidden");
        }
      }
    });
  }

  /**
   * دالة ذكية بتلف على كل لينكات الـ Navbar وتنور اللينك الحالي
   */
  updateActiveNavbarLink(currentHash) {
    // هنجيب كل عناصر الـ <a> اللي جوه الناف بار بتاعك اللي واخدين href بيبدأ بـ #
    const navLinks = document.querySelectorAll("nav a, .sidebar a"); // حطينا nav و sidebar عشان يلقطهم في أي مكان
    
    navLinks.forEach(link => {
      const linkHash = link.getAttribute("href");
      
      // لو الـ hash بتاع اللينك هو نفسه الـ hash اللي اليوزر واقف عليه حالياً
      if (linkHash === currentHash || (currentHash === "#/meal-details" && linkHash === "#/home")) {
        // 🟢 شكل الـ Active (تعدل الكلاسات دي بناءً على تصميمك - مثلاً هنا خلفية خضرا خفيفة وكلام أخضر)
        link.classList.add("bg-emerald-50", "text-emerald-600", "font-semibold");
        link.classList.remove("text-gray-600", "hover:bg-gray-50");
      } else {
        // ⚪ شكل اللينك الطبيعي غير النشط
        link.classList.remove("bg-emerald-50", "text-emerald-600", "font-semibold");
        link.classList.add("text-gray-600", "hover:bg-gray-50");
      }
    });
  }
}