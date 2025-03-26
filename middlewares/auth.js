// middlewares/auth.js
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized. Please log in." });
};

module.exports = { ensureAuthenticated };
