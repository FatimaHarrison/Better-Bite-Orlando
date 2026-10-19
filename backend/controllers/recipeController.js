import { recipeDAO } from "../repositories/recipeRepository.js";

const validId = (value) =>
	Number.isSafeInteger(Number(value)) && Number(value) > 0;

// GET /api/recipes
export const getAllRecipes = async (req, res) => {
	try {
		const recipes = await recipeDAO.getAllRecipes();

		res.status(200).json(recipes);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch recipes" });
	}
};

// GET /api/recipes/:id
export const getRecipeById = async (req, res) => {
	try {
		if (!validId(req.params.id)) {
			return res.status(400).json({ message: "Invalid recipe ID" });
		}

		const recipe = await recipeDAO.getRecipeById(req.params.id);

		if (!recipe) {
			return res.status(404).json({ message: "Recipe not found" });
		}

		res.status(200).json(recipe);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch recipe" });
	}
};

// GET /api/recipes/user/:userId
export const getRecipesByUser = async (req, res) => {
	try {
		if (!validId(req.params.userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		const recipes = await recipeDAO.getRecipesByUser(req.params.userId);

		res.status(200).json(recipes);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch user recipes" });
	}
};

// POST /api/recipes
export const createRecipe = async (req, res) => {
	try {
		const {
			username,
			userId,
			isVegan = false,
			isVegetarian = false,
			isLowCarb = false,
			isHighProtein = false,
		} = req.body ?? {};

		if (
			typeof username !== "string" ||
			!username.trim() ||
			!validId(userId)
		) {
			return res.status(400).json({
				message: "Valid username and userId are required",
			});
		}

		const preferences = {
			isVegan,
			isVegetarian,
			isLowCarb,
			isHighProtein,
		};

		if (Object.values(preferences).some((v) => typeof v !== "boolean")) {
			return res.status(400).json({
				message: "Dietary fields must be booleans",
			});
		}

		const recipe = await recipeDAO.createRecipe({
			username: username.trim(),
			userId: Number(userId),
			...preferences,
		});

		res.status(201).json(recipe);
	} catch (error) {
		console.error(error);

		if (error.code === "P2003") {
			return res.status(400).json({
				message: "Referenced user does not exist",
			});
		}

		res.status(500).json({ message: "Failed to create recipe" });
	}
};

// PUT /api/recipes/:id
export const updateRecipe = async (req, res) => {
	try {
		if (!validId(req.params.id)) {
			return res.status(400).json({ message: "Invalid recipe ID" });
		}

		const allowed = [
			"username",
			"isVegan",
			"isVegetarian",
			"isLowCarb",
			"isHighProtein",
		];

		const data = {};

		for (const field of allowed) {
			if (req.body?.[field] !== undefined) {
				const value = req.body[field];

				if (field === "username") {
					if (typeof value !== "string" || !value.trim()) {
						return res.status(400).json({
							message: "Username must be a nonempty string",
						});
					}
					data[field] = value.trim();
				} else {
					if (typeof value !== "boolean") {
						return res.status(400).json({
							message: `${field} must be a boolean`,
						});
					}
					data[field] = value;
				}
			}
		}

		if (!Object.keys(data).length) {
			return res.status(400).json({
				message: "No valid fields provided",
			});
		}

		const recipe = await recipeDAO.updateRecipe(req.params.id, data);

		res.status(200).json(recipe);
	} catch (error) {
		console.error(error);

		if (error.code === "P2025") {
			return res.status(404).json({ message: "Recipe not found" });
		}

		res.status(500).json({ message: "Failed to update recipe" });
	}
};

// DELETE /api/recipes/:id
export const deleteRecipe = async (req, res) => {
	try {
		if (!validId(req.params.id)) {
			return res.status(400).json({ message: "Invalid recipe ID" });
		}

		await recipeDAO.deleteRecipe(req.params.id);

		res.status(200).json({
			message: "Recipe deleted successfully",
		});
	} catch (error) {
		console.error(error);

		if (error.code === "P2025") {
			return res.status(404).json({ message: "Recipe not found" });
		}

		res.status(500).json({ message: "Failed to delete recipe" });
	}
};
