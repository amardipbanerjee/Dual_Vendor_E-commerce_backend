// middlewares/roleCheck.js
const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    // Ensure that the user exists and check their role using the model name
    if (req.user && allowedRoles.includes(req.user.constructor.modelName)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient permissions." });
  };
};

module.exports = { checkRole };
