import express from "express";

import {
	getAllRecipes,
	getRecipeById,
} from "../controllers/recipeController.js";

const router = express.Router();

// GET /recipes
// Search recipes using Spoonacular
router.get("/", getAllRecipes);

// GET /recipes/:id
// Retrive recipe details using a Spoonacular recipe ID
router.get("/:id", getRecipeById);

export default router;
