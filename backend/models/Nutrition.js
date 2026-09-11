class Nutrition {
	constructor({
		calories = null,
		protein = null,
		carbs = null,
		fat = null,
	} = {}) {
		this.calories = calories;
		this.protein = protein;
		this.carbs = carbs;
		this.fat = fat;
	}
}
