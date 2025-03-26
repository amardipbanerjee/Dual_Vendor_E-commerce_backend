const Admin = require("../models/Admin");
const passport = require("passport");

exports.login = async (req, res, next) => {
  passport.authenticate("local-admin", (err, admin, info) => {
    if (err) return next(err);
    if (!admin) return res.status(400).json({ message: info.message });
    req.login(admin, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "Admin login successful", admin });
    });
  })(req, res, next);
};
