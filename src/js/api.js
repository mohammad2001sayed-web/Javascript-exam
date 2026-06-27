// src/js/api.js

export class APIService {
    constructor() {
        // اللينك الأساسي لـ API الوجبات
        this.mealBaseUrl = 'https://www.themealdb.com/api/json/v1/1';
    }

    /**
     * 1️⃣ جلب الوجبات الابتدائية للهوم بيج (أول 25 وجبة)
     */
    async getInitialMeals() {
        try {
            const response = await fetch(`${this.mealBaseUrl}/search.php?s=`);
            const data = await response.json();
            return data.meals ? data.meals.slice(0, 25) : [];
        } catch (error) {
            console.error("حدث خطأ أثناء جلب الوجبات الابتدائية:", error);
            return [];
        }
    }

    /**
     * 2️⃣ جلب جميع الأقسام (Categories) المتاحة
     */
    async getCategories() {
        try {
            const response = await fetch(`${this.mealBaseUrl}/categories.php`);
            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error("حدث خطأ أثناء جلب الأقسام:", error);
            return [];
        }
    }

    /**
     * 3️⃣ جلب الأكلات التابعة لقسم معين (مثل: Beef, Pasta)
     */
    async getMealsByCategory(categoryName) {
        try {
            const response = await fetch(`${this.mealBaseUrl}/filter.php?c=${categoryName}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error(`حدث خطأ أثناء جلب أكلات القسم ${categoryName}:`, error);
            return [];
        }
    }

    /**
     * 4️⃣ جلب الأكلات التابعة لمطبخ أو بلد معين (مثل: Egyptian, Italian)
     */
    async getMealsByCuisine(cuisineName) {
        try {
            const response = await fetch(`${this.mealBaseUrl}/filter.php?a=${cuisineName}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error(`حدث خطأ أثناء جلب أكلات المطبخ ${cuisineName}:`, error);
            return [];
        }
    }

    /**
     * 5️⃣ البحث عن الأكلات بالاسم عبر الـ Input
     */
    async searchMealsByName(name) {
        try {
            const response = await fetch(`${this.mealBaseUrl}/search.php?s=${name}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error(`حدث خطأ أثناء البحث عن الوجبة ${name}:`, error);
            return [];
        }
    }

    /**
     * 6️⃣ جلب تفاصيل وجبة معينة بالكامل باستخدام الـ ID
     */
    async getMealDetailsById(id) {
        try {
            const response = await fetch(`${this.mealBaseUrl}/lookup.php?i=${id}`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error(`حدث خطأ أثناء جلب تفاصيل الوجبة ذات المعرف ${id}:`, error);
            return null;
        }
    }
}               