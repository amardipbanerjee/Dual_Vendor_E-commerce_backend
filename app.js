// ap.js
const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const connectDB = require("./config/db");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const dotenv = require("dotenv");

const errorHandler = require("./utils/errorHandler");

dotenv.config();

const app = express();

// ----- Database Connection -----
connectDB();

// ----- Security Middlewares -----
app.use(helmet());
app.use(cors());

// ----- Body Parsing -----
app.use(express.json());

// ----- Logging with Morgan -----
app.use(morgan("combined"));

// ----- Rate Limiting -----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ----- Session Setup -----
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// ----- Passport Initialization -----
app.use(passport.initialize());
app.use(passport.session());

// ----- Mounting Router Files -----
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/sellers", require("./routes/sellerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ----- Catch-All Route -----
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

// ----- Global Error Handler -----
app.use(errorHandler);

// ----- Start Server -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
