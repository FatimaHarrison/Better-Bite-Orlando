import express from "express";
import {
	getMeals,
	getMealById,
	testApiKey,
	protectedMealPost,
} from "../controllers/mealController.js";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

const router = express.Router();

// GET, POST, PUT, DELETE
// http://localhost:3000

// GET /meals
// Returns all meals or filters by category, restaurant, dietary type, or meal name
router.get("", getMeals);

// GET /meals/:id
// Returns one meal using its ID
router.get("/:id", getMealById);

// Protected test route for API key authentication
router.post("/auth-test", apiKeyAuth, testApiKey);
// Protected route example
router.post("/", apiKeyAuth, protectedMealPost);

export default router;
