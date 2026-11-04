import express from "express";
import {
	getGroceries,
	getFarmerMarkets,
	getFoodPantries,
	getRestaurants,
} from "../controllers/placeController.js";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

const router = express.Router();

// GET /groceries
router.get("/groceries", getGroceries);

// GET /farmer-markets
router.get("/farmer-markets", getFarmerMarkets);

// GET /food-pantries
router.get("/food-pantries", getFoodPantries);

// GET /restaurants
router.get("/restaurants", getRestaurants);

export default router;
