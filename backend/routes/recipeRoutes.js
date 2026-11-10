import express from "express";

import {
    getAllRecipes,
    getRecipeById,
} from "../controllers/recipeController.js";

const router = express.Router();

// Search Spoonacular recipes
router.get("/", getAllRecipes);

// Retrieve a Spoonacular recipe by ID
router.get("/:id", getRecipeById);

export default router;