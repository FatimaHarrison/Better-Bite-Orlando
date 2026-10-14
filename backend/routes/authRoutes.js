import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

// GET, POST, PUT, DELETE
// http://localhost:3000

// POST /register
// Registers a new user with the provided information
router.post("/register", registerUser);

// POST /login
// Logs in a user with the provided email and password
router.post("/login", loginUser);

// POST /logout
// Logs out the current user(clears the cookie)
router.post("/logout", logoutUser);

// Returns all meals or filters by category, restaurant, dietary type, or meal name

// GET /meals/:id
// Returns one meal using its ID

export default router;
