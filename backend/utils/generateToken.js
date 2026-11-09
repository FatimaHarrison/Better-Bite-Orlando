import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
	const payload = { id: userId };
	const secret = process.env.JWT_SECRET || "your_jwt_secret_key";

	const rawExpires = process.env.JWT_EXPIRES_IN || "7d";
	const expiresIn = rawExpires.trim().split(" ")[0];

	const token = jwt.sign(payload, secret, {
		expiresIn: expiresIn,
	});

	res.cookie("cookie", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // Set to true in production
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
	});

	return token;
};
