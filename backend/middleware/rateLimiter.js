import { rateLimit } from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        error: "Too many requests",
        message: "Please try again later.",
    },
});

export default apiLimiter;