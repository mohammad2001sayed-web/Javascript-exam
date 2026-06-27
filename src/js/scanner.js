// src/js/scanner.js

export class ScannerController {
  constructor() {
    this.productsGrid = document.getElementById("products-grid");
    this.productsCount = document.getElementById("products-count");
    this.nameInput = document.getElementById("product-search-input");
    this.searchNameBtn = document.getElementById("search-product-btn");
    this.barcodeInput = document.getElementById("barcode-input");
    this.lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
    
    this.currentProducts = [];
    this.activeGradeFilter = ""; 

    // داتا احتياطية بسيطة جداً فقط في حالة انقطاع الإنترنت بالكامل
    this.fallbackProducts = [
      {
        code: "5449000000996",
        product_name: "Coca-Cola Original Taste",
        brands: "The Coca-Cola Company",
        image_front_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=60",
        quantity: "33 cl",
        nutrition_grades: "e",
        nova_group: 4,
        nutriments: { "energy-kcal_100g": 42, protein_100g: 0, carbohydrates_100g: 10.6, fat_100g: 0, sugars_100g: 10.6 }
      }
    ];
  }

  init() {
    this.setupEventListeners();
  }

  // دالة جلب البيانات من السيرفر الخارجي
  async fetchFromOpenFoodFacts(url) {
    try {
      this.showLoading();
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network error");
      return await response.json();
    } catch (error) {
      console.warn("API Error, using fallback:", error);
      return null;
    }
  }

  setupEventListeners() {
    // 1. زرار البحث بالاسم (تعديل الـ Logic لقرأة داتا السيرفر كاملة)
    this.searchNameBtn?.addEventListener("click", async () => {
      const query = this.nameInput.value.trim().toLowerCase();
      if (!query) return;
      
      // طلب 24 منتج حقيقي من السيرفر مباشرة لملء الصفحة
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=24`;
      const data = await this.fetchFromOpenFoodFacts(url);
      
      // 🎯 التصليح هنا: التأكد من أن السيرفر رجع مصفوفة منتجات حقيقية وحفظها بالكامل
      if (data && data.products && Array.isArray(data.products) && data.products.length > 0) {
        this.currentProducts = data.products;
      } else {
        // لو السيرفر هو اللي وقع خالص، نرجع للـ Fallback المحلي بالاسم
        this.currentProducts = this.fallbackProducts.filter(p => 
          p.product_name.toLowerCase().includes(query)
        );
        if (this.currentProducts.length === 0) this.currentProducts = this.fallbackProducts;
      }
      this.applyFiltersAndRender();
    });

    // 2. زرار البحث بالباركود
    this.lookupBarcodeBtn?.addEventListener("click", async () => {
      const barcode = this.barcodeInput.value.trim();
      if (!barcode) return;
      
      const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
      const data = await this.fetchFromOpenFoodFacts(url);
      
      if (data && data.status === 1 && data.product) {
        this.currentProducts = [data.product];
      } else {
        this.currentProducts = this.fallbackProducts.filter(p => p.code === barcode);
        if (this.currentProducts.length === 0) this.currentProducts = this.fallbackProducts;
      }
      this.applyFiltersAndRender();
    });

    // 3. فلاتر الـ Nutri-Score
    const filterButtons = document.querySelectorAll(".nutri-score-filter, [data-grade]");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        filterButtons.forEach(b => {
          b.classList.remove("bg-emerald-600", "text-white");
          b.classList.add("bg-gray-100", "text-gray-700");
        });
        e.currentTarget.classList.remove("bg-gray-100", "text-gray-700");
        e.currentTarget.classList.add("bg-emerald-600", "text-white");
        
        const grade = e.currentTarget.getAttribute("data-grade") || e.currentTarget.textContent.trim();
        this.activeGradeFilter = (grade === "All" || !grade) ? "" : grade.toLowerCase();
        this.applyFiltersAndRender();
      });
    });

    // 4. فلاتر التصنيفات (Browse by Category)
    const categoryButtons = document.querySelectorAll(".product-category-btn, [class*='product-category']");
    categoryButtons.forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const categoryText = e.currentTarget.textContent.trim().toLowerCase();
        
        const url = `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(categoryText)}&action=process&json=1&page_size=24`;
        const data = await this.fetchFromOpenFoodFacts(url);
        
        if (data && data.products && data.products.length > 0) {
          this.currentProducts = data.products;
        }
        this.applyFiltersAndRender();
      });
    });
  }

  applyFiltersAndRender() {
    let filtered = [...this.currentProducts];

    if (this.activeGradeFilter) {
      filtered = filtered.filter(p => p.nutrition_grades === this.activeGradeFilter);
    }

    if (this.productsCount) {
      this.productsCount.textContent = `Found ${filtered.length} products`;
    }

    if (filtered.length === 0) {
      this.productsGrid.innerHTML = `
        <div class="col-span-full text-center py-12 text-gray-500">
          <i class="fa-solid fa-basket-shopping text-4xl mb-2 text-gray-300"></i>
          <p class="font-medium">No products found matching your search.</p>
        </div>
      `;
      return;
    }

    this.productsGrid.innerHTML = filtered.map(product => {
      const brand = product.brands || product.brands_tags?.[0] || "Generic Brand";
      const name = product.product_name || product.product_name_en || "Food Product";
      
      // جلب رابط الصورة الحقيقي من السيرفر ببدائل متعددة لضمان الظهور
      const image = product.image_front_url || product.image_url || product.image_small_url || "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=60";
      const weight = product.quantity || "N/A";
      
      const kCal = product.nutriments?.["energy-kcal_100g"] ?? product.nutriments?.["energy-kcal_value"] ?? 0;
      const protein = product.nutriments?.protein_100g ?? 0;
      const carbs = product.nutriments?.carbohydrates_100g ?? 0;
      const fat = product.nutriments?.fat_100g ?? 0;
      const sugar = product.nutriments?.sugars_100g ?? 0;
      
      const grade = product.nutrition_grades ? product.nutrition_grades.toUpperCase() : "UNKNOWN";
      const nova = product.nova_group || "N/A";

      return `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${product.code}">
          <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden p-4">
            <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${image}" alt="${name}" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=60'" />
            <div class="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Score ${grade}</div>
            <div class="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">${nova}</div>
          </div>
          <div class="p-4">
            <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${brand}</p>
            <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors h-10">${name}</h3>
            <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span><i class="fa-solid fa-weight-scale mr-1"></i>${weight}</span>
              <span><i class="fa-solid fa-fire mr-1"></i>${Math.round(kCal)} kcal/100g</span>
            </div>
            <div class="grid grid-cols-4 gap-1 text-center">
              <div class="bg-emerald-50 rounded p-1.5">
                <p class="text-xs font-bold text-emerald-700">${parseFloat(protein).toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Protein</p>
              </div>
              <div class="bg-blue-50 rounded p-1.5">
                <p class="text-xs font-bold text-blue-700">${parseFloat(carbs).toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Carbs</p>
              </div>
              <div class="bg-purple-50 rounded p-1.5">
                <p class="text-xs font-bold text-purple-700">${parseFloat(fat).toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Fat</p>
              </div>
              <div class="bg-orange-50 rounded p-1.5">
                <p class="text-xs font-bold text-orange-700">${parseFloat(sugar).toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Sugar</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // ربط الكروت بالـ Food Log
    this.productsGrid.querySelectorAll(".product-card").forEach((card, index) => {
      card.addEventListener("click", () => {
        const selectedProduct = filtered[index];
        if (window.foodLogCtrl) {
          window.foodLogCtrl.addMeal(selectedProduct);
          alert(`🎯 ${selectedProduct.product_name || 'Product'} has been logged to your Daily Food Log!`);
        }
      });
    });
  }

  showLoading() {
    if (this.productsGrid) {
      this.productsGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fa-solid fa-circle-notch animate-spin text-3xl text-emerald-600 mb-2"></i>
          <p class="text-emerald-600 font-medium">Scanning food database...</p>
        </div>
      `;
    }
  }
}