import express from "express";
import mealRepository from "../repositories/mealRepository.js";

const router = express.Router();

// GET, POST, PUT, DELETE
// http://localhost:3000

// GET /meals
// Returns all meals or filters by category, restaurant, dietary type, or meal name
router.get("", async (req, res) => {
	try {
		const { category, restaurantId, dietary, search } = req.query;

		let meals;

		if (category) {
			meals = await mealRepository.findByCategory(category);
		} else if (restaurantId) {
			meals = await mealRepository.findByRestaurant(restaurantId);
		} else if (dietary) {
			meals = await mealRepository.findByDietary(dietary);
		} else if (search) {
			meals = await mealRepository.findByName(search);
		} else {
			meals = await mealRepository.findAll();
		}

		res.status(200).json(meals);
	} catch (error) {
		console.error("Error retrieving meals:", error);

		res.status(500).json({
			error: "Unable to retrieve meals",
		});
	}
});

// GET /meals/:id
// Returns one meal using its ID
router.get("/:id", async (req, res) => {
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
});

export default router;
