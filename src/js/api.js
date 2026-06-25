export class APIService {
  constructor() {
    this.mealBaseUrl = "https://www.themealdb.com/api/json/v1/1";
  }

  async getInitialMeals() {
    try {
      const response = await fetch(
        `${this.mealBaseUrl}/search.php?s=`
      );

      const data = await response.json();

      return data.meals ? data.meals.slice(0, 25) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getMealsByCategory(category) {
    try {
      const response = await fetch(
        `${this.mealBaseUrl}/filter.php?c=${category}`
      );

      const data = await response.json();

      return data.meals || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}