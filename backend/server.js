import express from "express";

//Route Imports
import mealsRoutes from "./routes/mealsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = 3000;

//Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/meals", mealsRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
	console.log(`Server is running on PORT http://localhost:${port}`);
});
