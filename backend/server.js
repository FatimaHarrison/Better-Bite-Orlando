import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

//Route Imports
import mealRoutes from "./routes/mealRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";

const app = express();

// Frontend development origins
const allowedOrigins = [
	"https://dev.betterbiteorlando.com",
	"http://localhost:3000",
	"http://localhost:5173",
	"http://127.0.0.1:5173",
];

app.use(
	cors({
		origin: allowedOrigins,
		methods: ["GET", "HEAD", "OPTIONS"],
	}),
);

const port = Number(process.env.PORT || 3001);
const host = "127.0.0.1";

//Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/meals", mealRoutes);
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/places", placeRoutes);

app.listen(port, host, () => {
	console.log(`API listening at http://${host}:${port}`);
});
