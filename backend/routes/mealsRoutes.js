import express from "express";

const router = express.Router();

// GET, POST, PUT, DELETE
// http://localhost:3000
router.get("", (req, res) => {
	res.send("Hello, Your Meals Have Been Loaded!");
});

router.get("/:id", (req, res) => {
	res.send(`Hello, Your Meal Has Been Loaded! Meal ID: ${req.params.id}`);
});

export default router;
