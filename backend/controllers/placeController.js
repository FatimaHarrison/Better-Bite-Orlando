import {
	normalizeGrocery,
	normalizeFoodPantry,
	normalizeRestaurant,
	normalizeFarmersMarket,
} from "../utils/normalization.js";

const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v2/places";
const GEOAPIFY_GEOCODE_URL = "https://api.geoapify.com/v1/geocode/search";
const USDA_BASE_URL = "https://www.usdalocalfoodportal.com/api/farmersmarket/";
const FEEDING_AMERICA_BASE_URL = "https://feedam.org/api/resources/search";
const ORLANDO_PLACE_ID =
	"5197adf545425854c059db72897ec88a3c40f00101f901bb37110000000000c002089203074f726c616e646f";

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

function validCoordinate(value, min, max) {
	const number = Number(value);
	return Number.isFinite(number) && number >= min && number <= max
		? number
		: null;
}

async function resolveOrigin(query, apiKey) {
	const lat = validCoordinate(query.lat, -90, 90);
	const lon = validCoordinate(query.lon, -180, 180);

	if (lat !== null && lon !== null) return { lat, lon };

	const location = String(query.location ?? query.zip ?? "").trim();

	if (!location) {
		throw Object.assign(
			new Error("Provide location (address or ZIP), or lat and lon"),
			{ status: 400 },
		);
	}

	const isUSZip = /^\d{5}(?:-\d{4})?$/.test(location);
	const params = new URLSearchParams({
		text: location,
		filter: "countrycode:us",
		format: "json",
		limit: "1",
		apiKey,
	});

	if (isUSZip) params.set("type", "postcode");

	const payload = await fetchJson(
		`${GEOAPIFY_GEOCODE_URL}?${params}`,
		"Geoapify forward geocoding",
	);

	const result = payload?.results?.[0];
	const resolvedLat = validCoordinate(result?.lat, -90, 90);
	const resolvedLon = validCoordinate(result?.lon, -180, 180);

	if (resolvedLat === null || resolvedLon === null) {
		throw Object.assign(new Error(`Could not locate: ${location}`), {
			status: 400,
		});
	}

	return { lat: resolvedLat, lon: resolvedLon };
}

function coordsOf(item) {
	const lat = validCoordinate(item.latitude, -90, 90);
	const lon = validCoordinate(item.longitude, -180, 180);
	return lat === null || lon === null ? null : { lat, lon };
}

function distanceMiles(a, b) {
	const radians = (degrees) => (degrees * Math.PI) / 180;
	const dLat = radians(b.lat - a.lat);
	const dLon = radians(b.lon - a.lon);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(radians(a.lat)) *
			Math.cos(radians(b.lat)) *
			Math.sin(dLon / 2) ** 2;
	return 3958.7613 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function filterByDistance(items, origin, maxDistance) {
	if (maxDistance === null) return items;
	return items
		.map((item) => {
			const coords = coordsOf(item);
			return coords
				? {
						...item,
						distanceMiles: Number(
							distanceMiles(origin, coords).toFixed(2),
						),
					}
				: null;
		})
		.filter((item) => item && item.distanceMiles <= maxDistance);
}

async function fetchGeoapify(type, origin, maxDistance, query, apiKey) {
	const category =
		type === "groceries"
			? query.category || "commercial.supermarket"
			: null;
	const categories =
		category || "commercial.supermarket,commercial.marketplace";
	const params = new URLSearchParams({
		apiKey,
		categories,
		filter:
			maxDistance !== null
				? `circle:${origin.lon},${origin.lat},${Math.round(maxDistance * 1609.344)}`
				: `place:${process.env.GEOAPIFY_PLACE_ID || ORLANDO_PLACE_ID}`,
		limit: String(Math.min(Math.max(Number(query.limit) || 100, 1), 500)),
	});
	if (query.conditions) params.set("conditions", String(query.conditions));
	const payload = await fetchJson(
		`${GEOAPIFY_BASE_URL}?${params}`,
		"Geoapify groceries",
	);
	return getRecords(payload)
		.map(normalizeGrocery)
		.map((item) => ({ ...item, type: "grocery" }));
}

async function fetchFarmersMarkets(origin, maxDistance, query = {}) {
	const apiKey = process.env.GEOAPIFY_API_KEY;
	if (!apiKey) {
		throw Object.assign(new Error("GEOAPIFY_API_KEY is not configured"), {
			status: 500,
		});
	}

	const radiusMiles = maxDistance ?? Number(query.radius ?? 30);
	if (!Number.isFinite(radiusMiles) || radiusMiles <= 0) {
		throw Object.assign(
			new Error("radius must be a positive number of miles"),
			{
				status: 400,
			},
		);
	}

	const radiusMeters = Math.round(radiusMiles * 1609.344);
	const params = new URLSearchParams({
		apiKey,
		categories: "commercial.marketplace",
		filter: `circle:${origin.lon},${origin.lat},${radiusMeters}`,
		bias: `proximity:${origin.lon},${origin.lat}`,
		limit: String(Math.min(Math.max(Number(query.limit) || 100, 1), 500)),
	});
	if (query.conditions) params.set("conditions", String(query.conditions));

	const payload = await fetchJson(
		`${GEOAPIFY_BASE_URL}?${params}`,
		"Geoapify farmers markets",
	);

	return getRecords(payload)
		.map(normalizeFarmersMarket)
		.map((item) => ({ ...item, type: "farmers-market" }));
}

async function fetchPantries(location, query) {
	const search = String(location || query.location || query.zip || "").trim();
	if (!search)
		throw Object.assign(
			new Error("A location is required to search food pantries"),
			{ status: 400 },
		);
	const params = new URLSearchParams({ zip: search });
	const payload = await fetchJson(
		`${FEEDING_AMERICA_BASE_URL}?${params}`,
		"Feeding America food pantries",
	);
	return getRecords(payload)
		.map(normalizeFoodPantry)
		.map((item) => ({ ...item, type: "food-pantry" }));
}

// GET /places/groceries?types=groceries,farmers-markets,food-pantries&location=32819&maxDistance=10
export const findGroceries = async (req, res) => {
	const rawTypes = req.query.types ?? req.query.type ?? "groceries";
	const types = (
		Array.isArray(rawTypes) ? rawTypes : String(rawTypes).split(",")
	)
		.map((type) => String(type).trim().toLowerCase().replaceAll("_", "-"))
		.filter(Boolean);
	const allowed = new Set(["groceries", "farmers-markets", "food-pantries"]);
	const invalid = types.filter((type) => !allowed.has(type));
	if (invalid.length || !types.length) {
		return res.status(400).json({
			error: "types must include groceries, farmers-markets, and/or food-pantries",
			invalidTypes: invalid,
		});
	}

	const distanceValue = req.query.maxDistance;
	const maxDistance =
		distanceValue === undefined ? null : Number(distanceValue);
	if (
		maxDistance !== null &&
		(!Number.isFinite(maxDistance) || maxDistance <= 0)
	) {
		return res
			.status(400)
			.json({ error: "maxDistance must be a positive number of miles" });
	}

	const needsOrigin =
		types.includes("groceries") ||
		types.includes("farmers-markets") ||
		maxDistance !== null;
	const geoapifyKey = process.env.GEOAPIFY_API_KEY;
	if (needsOrigin && !geoapifyKey) {
		return res.status(500).json({
			error: "GEOAPIFY_API_KEY is required to resolve the frontend location",
		});
	}

	try {
		const origin = needsOrigin
			? await resolveOrigin(req.query, geoapifyKey)
			: {
					lat: validCoordinate(req.query.lat, -90, 90),
					lon: validCoordinate(req.query.lon, -180, 180),
				};
		const location = String(
			req.query.location ?? req.query.zip ?? "",
		).trim();
		const jobs = [];
		if (types.includes("groceries"))
			jobs.push(
				fetchGeoapify(
					"groceries",
					origin,
					maxDistance,
					req.query,
					geoapifyKey,
				),
			);
		if (types.includes("farmers-markets"))
			jobs.push(fetchFarmersMarkets(origin, maxDistance, req.query));
		if (types.includes("food-pantries"))
			jobs.push(fetchPantries(location, req.query));

		const groups = await Promise.all(jobs);
		let results = groups.flat();
		if (maxDistance !== null)
			results = filterByDistance(results, origin, maxDistance);
		return res.status(200).json(results);
	} catch (error) {
		console.error("Error finding groceries:", error);
		return res.status(error.status || 502).json({
			error: error.message || "Unable to find nearby food resources",
		});
	}
};

export const getRestaurants = async (req, res) => {
	const apiKey = process.env.GEOAPIFY_API_KEY;
	if (!apiKey)
		return res
			.status(500)
			.json({ error: "GEOAPIFY_API_KEY is not configured" });

	const maxDistance =
		req.query.maxDistance === undefined
			? null
			: Number(req.query.maxDistance);
	if (
		maxDistance !== null &&
		(!Number.isFinite(maxDistance) || maxDistance <= 0)
	) {
		return res
			.status(400)
			.json({ error: "maxDistance must be a positive number of miles" });
	}

	try {
		const origin = await resolveOrigin(req.query, apiKey);
		const params = new URLSearchParams({
			apiKey,
			categories: req.query.category || "catering.restaurant",
			filter: `circle:${origin.lon},${origin.lat},${Math.round((maxDistance ?? Number(req.query.radius ?? 10)) * 1609.344)}`,
			limit: String(
				Math.min(Math.max(Number(req.query.limit) || 20, 1), 500),
			),
		});
		if (req.query.conditions)
			params.set("conditions", String(req.query.conditions));

		const payload = await fetchJson(
			`${GEOAPIFY_BASE_URL}?${params}`,
			"Geoapify restaurants",
		);
		let restaurants = getRecords(payload).map(normalizeRestaurant);
		if (maxDistance !== null)
			restaurants = filterByDistance(restaurants, origin, maxDistance);
		return res.status(200).json(restaurants);
	} catch (error) {
		console.error("Error fetching restaurants:", error);
		return res.status(error.status || 502).json({
			error: error.message || "Unable to fetch Geoapify restaurants",
		});
	}
};
