import express from "express";

//Route Imports
import mealsRoutes from "./routes/mealsRoutes.js";

const app = express();
const port = 3000;

// API Routes
app.use("/meals", mealsRoutes);

app.listen(port, () => {
	console.log(`Server is running on PORT http://localhost:${port}`);
});
