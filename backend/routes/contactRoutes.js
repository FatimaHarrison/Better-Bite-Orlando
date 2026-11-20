import express from "express";
import rateLimit from "express-rate-limit";
import contactUs from "../controllers/contactController.js";

const router = express.Router();

// Endpoint-specific rate limiter: 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: "Too many contact requests from this IP address. Please try again after 15 minutes.",
	},
});

// POST /contact
// Send a contact message to the team and auto-reply to the user
router.post("/", contactLimiter, contactUs);

export default router;
