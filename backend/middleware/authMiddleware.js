import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const requireAuth = async (req, res, next) => {
  try {
    const authCookie = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("bbo_auth="));

    const token = authCookie?.slice("bbo_auth=".length);

    if (!token) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!Number.isInteger(decoded.id) || decoded.id <= 0) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    // Verify the authenticated user still exists.
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    req.userId = user.id;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid or expired authentication token",
      });
    }

    console.error("Authentication failed:", error);

    return res.status(500).json({
      error: "Unable to authenticate request",
    });
  }
};

export default requireAuth;
