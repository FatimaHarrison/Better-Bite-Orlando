import express from "express";

//Route Imports
import mealsRoutes from "./routes/mealsRoutes.js";

// API Routes
app.use("/meals", mealsRoutes);

const app = express();
const port = 3000;

app.listen(port, () => {
	console.log(`Server is running on PORT http://localhost:${port}`);
});
