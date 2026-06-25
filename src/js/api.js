// مسؤول عن أي Fetch من الـ APIs
export class APIService {
  constructor() {
    this.mealBaseUrl = "https://www.themealdb.com/api/json/v1/1";
  }

  // جلب أول 25 وجبة
  async getInitialMeals() {
    try {
      const response = await fetch(`${this.mealBaseUrl}/search.php?s=`);
      const data = await response.json();
      return data.meals ? data.meals.slice(0, 25) : [];
    } catch (error) {
      console.error("حدث خطأ أثناء جلب الوجبات:", error);
      return [];
    }
  }
}
