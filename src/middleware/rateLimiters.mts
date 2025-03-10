import rateLimit from "express-rate-limit";
import { rateLimits } from "../utils/constants.mjs";

// 429
const gloabalLimiter = rateLimit({
  windowMs: rateLimits.window,
  max: rateLimits.global,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests, please try again later.",
});

// Stricter rate limit for authentication attempts to prevent brute force attacks
export const authLimiter = rateLimit({
  windowMs: rateLimits.global,
  max: rateLimits.auth,
  skipSuccessfulRequests: true, // Don't count successful logins
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default gloabalLimiter;
