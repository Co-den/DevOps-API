/* eslint-disable no-unused-vars */
import aj from "#config/arcjet.js";
import { slidingWindow } from "@arcjet/node";
import loggers from "#config/logger.js";

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || "guest";

    let limit;
    let message;

    switch (role) {
      case "admin":
        limit = 20;
        message = "Admin request limited to 20 requests per minute. slow down";
        break;
      case "user":
        limit = 5;
        message = "User request limited to 10 requests per minute. slow down";
        break;
      case "guest":
        limit = 2;
        message = "Guest request limited to 5 requests per minute. slow down";
        break;
    }
    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit,
        name: `${role}-rate-limit`,
      }),
    );
    const descision = await client.protect(req);
    // BOT BLOCKING
    if (descision.isDenied() && descision.reason.isBot()) {
      loggers.warn("Bot request blocked:", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "Automated requests are not allowed.",
      });
    }
    //SHIELD BLOCK
    if (descision.isDenied() && descision.reason.isShield()) {
      loggers.warn("Shield request blocked:", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "Request blocked by security policy.",
      });
    }
    if (descision.isDenied() && descision.reason.isRateLimit()) {
      loggers.warn("Rate limit request blocked:", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "Too many requests.",
      });
    }
    next();
  } catch (err) {
    console.error("arcjet Middleware Error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred with security middleware.",
    });
  }
};

export default securityMiddleware;
