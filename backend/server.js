import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

//Route Imports
import mealsRoutes from "./routes/mealsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = 3000;

// Allow requests from our local frontent
app.use(cors({
	origin: [
		"http://127.0.0.1:5500",
		"http://localhost:5500"
	]
}));

//Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/meals", mealsRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
	console.log(`Server is running on PORT http://localhost:${port}`);
});
