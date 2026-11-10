
import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getCurrentUser
} from "../controllers/authController.js";

const router = express.Router();

// Public authentication endpoints

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
// Emails reset link
router.post("/forgot-password", forgotPassword);

// POST /password-reset
// Submits request to reset password
router.post("/password-reset", resetPassword);

// GET /profile
// Retrieve the currently authenticated user
router.get("/profile", getCurrentUser);

export default router;
