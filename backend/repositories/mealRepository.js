import prisma from "../lib/prisma.js";
import Meal from "../models/Meal.js";

class MealRepository {
	mapToMeal(meal) {
		if (!meal) {
			return null;
		}

		return new Meal({
			id: meal.id,
			name: meal.name,

			restaurant: meal.restaurant
				? {
					id: meal.restaurant.id,
					name: meal.restaurant.name,
				}
				: null,

			price: meal.price !== null ? Number(meal.price) : null,

			nutrition: meal.nutrition
				? {
					calories: meal.nutrition.calories,
					protein: meal.nutrition.protein,
					carbs: meal.nutrition.carbs,
					fat: meal.nutrition.fat,
				}
				: null,

			dietary: meal.dietary ?? [],

			category: meal.category,

			location: meal.location
				? {
					address: meal.location.address,
					lat: meal.location.lat,
					lon: meal.location.lon,
					distanceMiles: meal.location.distance_miles,
				}
				: null,

			rating: meal.rating,
		});
	}

	async findAll() {
		const meals = await prisma.meal.findMany({
			include: {
				restaurant: true,
				nutrition: true,
				location: true,
			},
		});

		return meals.map((meal) => this.mapToMeal(meal));
	}

	async findById(id) {
		const meal = await prisma.meal.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				restaurant: true,
				nutrition: true,
				location: true,
			},
		});

		return this.mapToMeal(meal);
	}

	async findByCategory(category) {
		const meals = await prisma.meal.findMany({
			where: {
				category,
			},
			include: {
				restaurant: true,
				nutrition: true,
				location: true,
			},
		});

		return meals.map((meal) => this.mapToMeal(meal));
	}

	async findByRestaurant(restaurantId) {
		const meals = await prisma.meal.findMany({
			where: {
				restaurantId: Number(restaurantId),
			},
			include: {
				restaurant: true,
				nutrition: true,
				location: true,
			},
		});

		return meals.map((meal) => this.mapToMeal(meal));
	}
	async findByDietary(dietary) {
		const meals = await this.findAll();

		return meals.filter((meal) => {
			return meal.dietary.some(
				(type) => type.toLowerCase() === dietary.toLowerCase()
			);
		});
	}

	async findByName(name) {
		const meals = await this.findAll();

		return meals.filter((meal) =>
			meal.name.toLowerCase().includes(name.toLowerCase())
		);
	}

}

export default new MealRepository();
