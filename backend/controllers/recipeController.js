import { normalizeRecipe } from "../utils/normalization.js";

const BASE_URL = "https://api.spoonacular.com/recipes";
const fail = (message, status = 400) =>
	Object.assign(new Error(message), { status });

function scalar(value, name) {
	if (typeof value !== "string" || !value.trim())
		throw fail(`${name} must be a nonempty string`);
	return value.trim();
}

function numeric(value, name, min = 0, max = Infinity, integer = false) {
	const text = scalar(value, name);
	const number = Number(text);
	if (
		!Number.isFinite(number) ||
		number < min ||
		number > max ||
		(integer && !Number.isInteger(number))
	) {
		throw fail(
			`${name} must be ${integer ? "an integer" : "a number"} between ${min} and ${max}`,
		);
	}
	return number;
}

async function request(path, params = {}) {
	const apiKey = process.env.SPOONACULAR_API_KEY;
	if (!apiKey) throw fail("SPOONACULAR_API_KEY is not configured", 500);
	const url = new URL(`${BASE_URL}/${path}`);
	url.search = new URLSearchParams({ ...params, apiKey }).toString();
	const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
	if (!response.ok) {
		throw fail(
			response.status === 404
				? "Recipe not found"
				: "Spoonacular request failed",
			response.status === 404 ? 404 : 502,
		);
	}
	return response.json();
}

function amount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0
		? value
		: null;
}

function handleError(res, error) {
	console.error("Recipe request failed:", error.message);
	return res.status(error.status ?? 502).json({
		message: error.status ? error.message : "Unable to fetch recipes",
	});
}

// GET /api/recipes
export const getAllRecipes = async (req, res) => {
	try {
		const q = req.query;
		for (const name of [
			"distance",
			"maxDistance",
			"maxMiles",
			"location",
			"zip",
			"address",
		]) {
			if (q[name] !== undefined)
				throw fail(
					"Recipes have no geographic location; use the places/meal endpoint for distance filtering",
				);
		}
		const params = {
			fillIngredients: "true",
			instructionsRequired: "true",
			addRecipeInstructions: "true",
			addRecipeNutrition: "true",
			addRecipeInformation: "true",
			number: String(
				q.number === undefined
					? 20
					: numeric(q.number, "number", 1, 100, true),
			),
			offset: String(
				q.offset === undefined
					? 0
					: numeric(q.offset, "offset", 0, 900, true),
			),
		};
		for (const name of ["query", "cuisine", "diet"]) {
			if (q[name] !== undefined) params[name] = scalar(q[name], name);
		}
		for (const name of [
			"maxReadyTime",
			"maxCarbs",
			"minProtein",
			"maxProtein",
			"maxCalories",
			"maxFat",
		]) {
			if (q[name] !== undefined)
				params[name] = String(numeric(q[name], name));
		}

		if (q.dietaryType !== undefined) {
			const types = scalar(q.dietaryType, "dietaryType")
				.toLowerCase()
				.split(",")
				.map((v) => v.trim().replace(/[ _]+/g, "-"));
			const diets = new Set(
				params.diet ? params.diet.split(",").map((v) => v.trim()) : [],
			);
			for (const type of types) {
				if (type === "vegan" || type === "vegetarian") diets.add(type);
				else if (type === "high-protein") params.minProtein ??= "30";
				else if (type === "low-carb") params.maxCarbs ??= "20";
				else
					throw fail(
						"dietaryType supports vegan, vegetarian, high-protein, low-carb",
					);
			}
			if (diets.size) params.diet = [...diets].join(",");
		}
		if (q.mealType !== undefined) {
			const mealType = scalar(q.mealType, "mealType").toLowerCase();
			const mapping = {
				breakfast: "breakfast",
				lunch: "main course",
				dinner: "main course",
				snack: "snack",
			};
			if (!mapping[mealType])
				throw fail("mealType supports breakfast, lunch, dinner, snack");
			params.type = mapping[mealType];
		}
		if (q.protein !== undefined) {
			const protein = scalar(q.protein, "protein")
				.toLowerCase()
				.replace(/g/g, "")
				.replace(/\s/g, "");
			if (["10", "20", "30"].includes(protein))
				params.minProtein = protein;
			else if (protein === "40-50") {
				params.minProtein = "40";
				params.maxProtein = "50";
			} else throw fail("protein supports 10g, 20g, 30g, or 40-50g");
		}
		if (
			params.maxProtein !== undefined &&
			Number(params.minProtein ?? 0) > Number(params.maxProtein)
		) {
			throw fail("minProtein cannot exceed maxProtein");
		}
		const budget =
			q.budget === undefined ? null : numeric(q.budget, "budget");
		const payload = await request("complexSearch", params);
		if (!Array.isArray(payload.results))
			throw fail("Unexpected Spoonacular search response", 502);
		const rawResults =
			budget === null
				? payload.results
				: payload.results.filter((recipe) => {
						const cents = amount(recipe.pricePerServing);
						return cents !== null && cents / 100 <= budget;
					});
		const results = rawResults.map(normalizeRecipe);
		return res.status(200).json({
			results,
			offset: payload.offset ?? Number(params.offset),
			number: results.length,
			upstreamTotalResults: payload.totalResults ?? null,
			metadata: {
				budgetCurrency: "USD",
				budgetBasis:
					"estimated ingredient cost per serving; not restaurant price",
				budgetAppliedToReturnedPage: budget !== null,
				defaults: { highProteinMinGrams: 30, lowCarbMaxGrams: 20 },
				proteinPolicy:
					"10g/20g/30g mean minimum; 40-50g is an inclusive range",
			},
		});
	} catch (error) {
		return handleError(res, error);
	}
};

// GET /api/recipes/:id (also accepts the existing /user/:recipeId route).
export const getRecipeById = async (req, res) => {
	try {
		const rawId = req.params.id ?? req.params.recipeId;
		if (
			typeof rawId !== "string" ||
			!/^\d+$/.test(rawId) ||
			!Number.isSafeInteger(Number(rawId)) ||
			Number(rawId) <= 0
		) {
			throw fail("Invalid recipe ID");
		}

		const recipe = await request(`${Number(rawId)}/information`, {
			includeNutrition: "true",
		});
		return res.status(200).json(normalizeRecipe(recipe));
	} catch (error) {
		return handleError(res, error);
	}
};
