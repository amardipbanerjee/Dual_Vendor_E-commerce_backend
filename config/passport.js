// config/passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Seller = require("../models/Seller");
const Admin = require("../models/Admin");

// Strategy for Users
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Incorrect email." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect password." });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Strategy for Sellers
passport.use(
  "local-seller",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const seller = await Seller.findOne({ email });
        if (!seller) return done(null, false, { message: "Incorrect email." });
        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect password." });
        return done(null, seller);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Strategy for Admins
passport.use(
  "local-admin",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const admin = await Admin.findOne({ email });
        if (!admin) return done(null, false, { message: "Incorrect email." });
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect password." });
        return done(null, admin);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user based on their type
passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: user.constructor.modelName });
});

passport.deserializeUser(async (userData, done) => {
  try {
    if (userData.type === "User") {
      const user = await User.findById(userData.id);
      return done(null, user);
    } else if (userData.type === "Seller") {
      const seller = await Seller.findById(userData.id);
      return done(null, seller);
    } else if (userData.type === "Admin") {
      const admin = await Admin.findById(userData.id);
      return done(null, admin);
    }
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
