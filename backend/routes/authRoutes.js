import { rateLimit } from "express-rate-limit";
import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	forgotPassword,
	resetPassword,
} from "../controllers/authController.js";

import apiKeyAuth from "../middleware/apiKeyAuth.js";


// limit registration attempts 
const registerLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: {
		error: "Too many registration attempts. Please try again later."
	}	
});


const router = express.Router();

// GET, POST, PUT, DELETE
// http://localhost:3000/auth

// POST /register
// Registers a new user with the provided information
router.post("/register", registerLimiter, registerUser);

// POST /login
// Logs in a user with the provided email and password
// removed apiKeyAuth -> Kenji 
router.post("/login",  loginUser);

// POST /logout
// Logs out the current user(clears the cookie)
router.post("/logout", apiKeyAuth, logoutUser);

// POST /forgot-password
//emails reset link
router.post("/forgot-password", apiKeyAuth, forgotPassword);

// POST /password-reset
// Submits request to reset password
router.post("/password-reset", apiKeyAuth, resetPassword);

export default router;
