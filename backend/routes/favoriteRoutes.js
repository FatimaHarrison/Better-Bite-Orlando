import express from "express";
import {
        getFavorites,
        getFavoriteById,
        createFavorite,
        deleteFavorite,
} from "../controllers/favoriteController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// All Favorites endpoints require an authenticated user.
router.use(requireAuth);

// GET /favorites
// GET /favorites?type=grocery|restaurant|recipe
router.get("/", getFavorites);

// GET /favorites/:id
router.get("/:id", getFavoriteById);

// POST /favorites
router.post("/", createFavorite);

// DELETE /favorites/:id
router.delete("/:id", deleteFavorite);

export default router;