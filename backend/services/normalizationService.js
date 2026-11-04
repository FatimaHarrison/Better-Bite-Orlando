// Normalizes restaurant data into one consistent format
// for the Better Bite Orlando frontend.

export function normalizeRestaurant(restaurant = {}) {
	const properties = restaurant.properties ?? restaurant;

	return {
		id: properties.id ?? properties.place_id ?? null,
		name: properties.name ?? null,

		address:
			properties.address ??
			properties.formatted ??
			properties.formatted_address ??
			null,

		latitude:
			properties.lat ??
			properties.latitude ??
			properties.geometry?.lat ??
			null,

		longitude:
			properties.lon ??
			properties.longitude ??
			properties.geometry?.lon ??
			null,

		website: properties.website ?? null,

		openingHours:
			properties.opening_hours ?? properties.openingHours ?? null,

		cuisine: properties.cuisine ?? properties.catering?.cuisine ?? null,

		dietaryOptions:
			properties.dietaryOptions ??
			properties.diet ??
			properties.categories ??
			[],

		menuUrl: properties.menu ?? properties.web ?? null,
	};
}
// Normalizes Spoonacular recipe data into a consistent format
// for the Better Bite Orlando frontend.

export function normalizeRecipe(recipe = {}) {
	const nutrients = recipe.nutrition?.nutrients ?? [];

	const getNutrient = (name) => {
		const nutrient = nutrients.find(
			(item) => item.name?.toLowerCase() === name.toLowerCase(),
		);

		return nutrient?.amount ?? null;
	};

	return {
		id: recipe.id ?? null,
		title: recipe.title ?? null,
		image: recipe.image ?? null,
		readyInMinutes: recipe.readyInMinutes ?? null,
		source: recipe.sourceName ?? recipe.sourceUrl ?? null,
		healthScore: recipe.healthScore ?? null,

		nutrition: {
			calories: getNutrient("Calories"),
			protein: getNutrient("Protein"),
			carbs: getNutrient("Carbohydrates"),
			fat: getNutrient("Fat"),
			saturatedFat: getNutrient("Saturated Fat"),
			sugar: getNutrient("Sugar"),
		},

		instructions:
			recipe.analyzedInstructions?.[0]?.steps?.map((step) => ({
				number: step.number,
				step: step.step,
			})) ?? [],

		dietary: {
			vegetarian: recipe.vegetarian ?? false,
			vegan: recipe.vegan ?? false,
			glutenFree: recipe.glutenFree ?? false,
			ketogenic: recipe.ketogenic ?? false,
		},
	};
}
// Normalizes Geoapify supermarket/grocery data into a consistent format
// for the Better Bite Orlando frontend.

export function normalizeGrocery(store = {}) {
	const properties = store.properties ?? store;

	return {
		id: properties.place_id ?? properties.id ?? null,
		name: properties.name ?? null,

		address:
			properties.formatted ??
			properties.address_line2 ??
			properties.address ??
			null,

		latitude: properties.lat ?? null,
		longitude: properties.lon ?? null,

		website: properties.website ?? null,

		openingHours: properties.opening_hours ?? null,

		categories: properties.categories ?? [],
	};
}
// Normalizes Feeding America food pantry and resource data into a consistent format
// for the Better Bite Orlando frontend.

export function normalizeFoodPantry(resource = {}) {
	const data = resource.properties ?? resource;

	// Safely extracts latitude and longitude across coordinate arrays,
	// nested location objects, or direct keys.
	const coordinates = Array.isArray(data.location?.coordinates)
		? data.location.coordinates
		: Array.isArray(data.coordinates)
			? data.coordinates
			: null;

	const latitude =
		data.lat ??
		data.latitude ??
		data.location?.lat ??
		data.location?.latitude ??
		(coordinates ? coordinates[1] : null);

	const longitude =
		data.lon ??
		data.lng ??
		data.longitude ??
		data.location?.lon ??
		data.location?.lng ??
		data.location?.longitude ??
		(coordinates ? coordinates[0] : null);

	// Standardizes address strings or structured address blocks.
	const address =
		typeof data.address === "string"
			? data.address
			: (data.address?.formatted ??
				data.formatted_address ??
				data.location?.address ??
				null);

	// Ensures organizations are returned consistently as an array of items/strings.
	const organizations = Array.isArray(data.organizations)
		? data.organizations
		: data.organization
			? [data.organization]
			: [];

	return {
		id: data.id ?? data._id ?? null,
		name: data.name ?? null,
		description: data.description ?? null,
		address: address,
		latitude: latitude,
		longitude: longitude,
		url: data.url ?? data.website ?? null,
		organizations: organizations,
	};
}
