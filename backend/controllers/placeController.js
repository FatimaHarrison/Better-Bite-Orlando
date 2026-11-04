import {
	normalizeGrocery,
	normalizeFoodPantry,
	normalizeRestaurant,
	normalizeFarmersMarket,
} from "../utils/normalization.js";

const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v2/places";
const USDA_BASE_URL = "https://www.usdalocalfoodportal.com/api/farmersmarket/";
const FEEDING_AMERICA_BASE_URL = "https://feedam.org/api/resources/search";

async function fetchJson(url, label) {
	const response = await fetch(url);

	if (!response.ok) {
		const detail = await response.text().catch(() => "");

		throw new Error(
			`${label} returned HTTP ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
		);
	}

	return response.json();
}

function getRecords(payload) {
	if (Array.isArray(payload)) return payload;

	for (const key of ["features", "results", "data", "resources", "markets"]) {
		if (Array.isArray(payload?.[key])) return payload[key];
	}

	return [];
}

function sendError(res, error, label) {
	console.error(`${label}:`, error);

	return res
		.status(502)
		.json({ error: `Unable to fetch ${label.toLowerCase()}` });
}

async function getGeoapifyPlaces({ category, req, res, normalizer, label }) {
	const apiKey = process.env.GEOAPIFY_API_KEY;
	if (!apiKey) {
		return res
			.status(500)
			.json({ error: "GEOAPIFY_API_KEY is not configured" });
	}

	const params = new URLSearchParams({
		apiKey,
		categories: category,
		filter: `place:${process.env.GEOAPIFY_PLACE_ID}`,
		limit: String(
			Math.min(Math.max(Number(req.query.limit) || 20, 1), 500),
		),
	});

	if (req.query.conditions)
		params.set("conditions", String(req.query.conditions));

	try {
		const payload = await fetchJson(
			`${GEOAPIFY_BASE_URL}?${params}`,
			label,
		);
		return res.status(200).json(getRecords(payload).map(normalizer));
	} catch (error) {
		return sendError(res, error, label);
	}
}

export const getGroceries = async (req, res) => {
	// Implementation for fetching groceries
	getGeoapifyPlaces({
		category: req.query.category || "commercial.supermarket",
		req,
		res,
		normalizer: normalizeGrocery,
		label: "Geoapify groceries",
	});
};

export const getFarmerMarkets = async (req, res) => {
	// Implementation for fetching farmer markets
	const apiKey = process.env.USDA_API_KEY;

	if (!apiKey) {
		return res
			.status(500)
			.json({ error: "USDA_API_KEY is not configured" });
	}

	const params = new URLSearchParams({
		apiKey,
		x: String(
			req.query.x ?? process.env.FARMERS_MARKET_LONGITUDE ?? "-81.3792",
		),
		y: String(
			req.query.y ?? process.env.FARMERS_MARKET_LATITUDE ?? "28.5383",
		),
		radius: String(
			req.query.radius ?? process.env.FARMERS_MARKET_RADIUS ?? "30",
		),
	});

	try {
		const payload = await fetchJson(
			`${USDA_BASE_URL}?${params}`,
			"USDA farmers markets",
		);
		return res
			.status(200)
			.json(getRecords(payload).map(normalizeFarmersMarket));
	} catch (error) {
		return sendError(res, error, "USDA farmers markets");
	}
};

export const getFoodPantries = async (req, res) => {
	const zip = String(
		req.query.zip || process.env.FOOD_PANTRY_SEARCH || "Orlando, FL",
	).trim();

	if (!zip)
		return res
			.status(400)
			.json({ error: "A zip or city,state search is required" });

	const params = new URLSearchParams({ zip });
	try {
		const payload = await fetchJson(
			`${FEEDING_AMERICA_BASE_URL}?${params}`,
			"Feeding America food pantries",
		);
		return res
			.status(200)
			.json(getRecords(payload).map(normalizeFoodPantry));
	} catch (error) {
		return sendError(res, error, "Feeding America food pantries");
	}
};

export const getRestaurants = async (req, res) => {
	// Implementation for fetching restaurants
	getGeoapifyPlaces({
		category: req.query.category || "catering.restaurant",
		req,
		res,
		normalizer: normalizeRestaurant,
		label: "Geoapify restaurants",
	});
};
