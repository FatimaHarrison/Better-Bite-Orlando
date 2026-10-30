import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	forgotPassword,
	resetPassword,
} from "../controllers/authController.js";

import apiKeyAuth from "../middleware/apiKeyAuth.js";

const router = express.Router();

// GET, POST, PUT, DELETE
// http://localhost:3000/auth

// POST /register
// Registers a new user with the provided information
router.post("/register", apiKeyAuth, registerUser);

// POST /login
// Logs in a user with the provided email and password
router.post("/login", apiKeyAuth, loginUser);

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
