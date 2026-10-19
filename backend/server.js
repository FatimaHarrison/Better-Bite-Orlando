import express from "express";
import dotenv from "dotenv";
dotenv.config();

//Route Imports
import mealsRoutes from "./routes/mealsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

const app = express();
const port = 3000;

//Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/meals", mealsRoutes);
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

app.listen(port, () => {
	console.log(`Server is running on PORT http://localhost:${port}`);
});
