import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	forgotPassword,
	resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// GET, POST, PUT, DELETE
// http://localhost:3000/auth

// POST /register
// Registers a new user with the provided information
router.post("/register", registerUser);

// POST /login
// Logs in a user with the provided email and password
router.post("/login", loginUser);

// POST /logout
// Logs out the current user(clears the cookie)
router.post("/logout", logoutUser);

// POST /forgot-password
//emails reset link
router.post("/forgot-password", forgotPassword);

// POST /password-reset
// Submits request to reset password
router.post("/password-reset", resetPassword);

export default router;
