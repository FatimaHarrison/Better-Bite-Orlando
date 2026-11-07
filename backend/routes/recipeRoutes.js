import express from "express";
import {
	getAllRecipes,
	getRecipeById,
} from "../controllers/recipeController.js";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

const router = express.Router();

// GET all recipes
router.get("/", getAllRecipes);

// GET a recipe by ID
router.get("/user/:recipeId", getRecipeById);

//all the rest marked for deletion, as they are not needed for the current implementation
// GET recipes by user ID
//router.get("/user/:userId", getRecipesByUser);

// POST a new recipe
//router.post("/", apiKeyAuth, createRecipe);

// PUT (update) a recipe by ID
//router.put("/:userId", apiKeyAuth, updateRecipe);

// DELETE a recipe by ID
//router.delete("/user/:userId", apiKeyAuth, deleteRecipe);

export default router;
