import mealRepository from "../repositories/mealRepository.js";

// GET /meals
// Returns all meals or filters by category, restaurant, dietary type, or name.
export const getMeals = async (req, res) => {
	try {
		const { category, restaurantId, dietary, search } = req.query;
		if (restaurantId) {
			const id = Number(restaurantId);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).json({
					error: "Invalid restaurant ID",
				});
			}
		}
		let meals = await mealRepository.findAll();

		if (category) {
			meals = meals.filter(
				(meal) => meal.category.toLowerCase() === category.toLowerCase()
			);
		}

		if (restaurantId) {
			meals = meals.filter(
				(meal) => meal.restaurant?.id === Number(restaurantId)
			);
		}

		if (dietary) {
			meals = meals.filter((meal) =>
				meal.dietary.some(
					(type) => type.toLowerCase() === dietary.toLowerCase()
				)
			);
		}

		if (search) {
			meals = meals.filter((meal) =>
				meal.name.toLowerCase().includes(search.toLowerCase())
			);
		}

		res.status(200).json(meals);
	} catch (error) {
		console.error("Error retrieving meals:", error);

		res.status(500).json({
			error: "Unable to retrieve meals",
		});
	}
};

// GET /meals/:id
export const getMealById = async (req, res) => {
	try {
		const id = Number(req.params.id);

		if (!Number.isInteger(id) || id <= 0) {
			return res.status(400).json({
				error: "Invalid meal ID",
			});
		}

		const meal = await mealRepository.findById(id);

		if (!meal) {
			return res.status(404).json({
				error: "Meal not found",
			});
		}

		res.status(200).json(meal);
	} catch (error) {
		console.error("Error retrieving meal:", error);

		res.status(500).json({
			error: "Unable to retrieve meal",
		});
	}
};

// POST /meals/auth-test (API-key protected by the route middleware)
export const testApiKey = (req, res) =>
	res.status(200).json({ message: "API key accepted" });

// POST /meals (API-key protected by the route middleware)
export const protectedMealPost = (req, res) => {
	try {
		return res.status(200).json({
			message: "Protected POST meal route accessed successfully",
		});
	} catch (error) {
		console.error("Error accessing protected meal route:", error);
		return res.status(500).json({ error: "Unable to process request" });
	}
};
