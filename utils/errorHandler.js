// utils/errorHandler.js

/**
 * Global error handler middleware for Express.
 * Logs error and sends JSON response.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    // In production, avoid sending err.stack to the client.
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

module.exports = errorHandler;
