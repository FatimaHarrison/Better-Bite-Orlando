import express from "express";
import {
	findGroceries,
	getRestaurants,
} from "../controllers/placeController.js";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

const router = express.Router();

// GET /groceries
router.get("/groceries", findGroceries);

// GET /restaurants
router.get("/restaurants", getRestaurants);

export default router;
