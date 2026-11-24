import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
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

    if (!Number.isInteger(decoded.id)) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    // Store the authenticated user's ID for protected controllers.
    req.userId = decoded.id;

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