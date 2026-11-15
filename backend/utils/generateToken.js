
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const token = jwt.sign(
    { id: userId },
    secret,
    { expiresIn }
  );

  res.cookie("bbo_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
