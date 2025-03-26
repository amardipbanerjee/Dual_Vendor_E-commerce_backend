// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { ensureAuthenticated } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");
const validateRequest = require("../middlewares/validateRequest");

// Import controllers
const UserAuthController = require("../controllers/UserAuthController");
const AccountController = require("../controllers/AccountController");
const CartController = require("../controllers/CartController");
const WishlistController = require("../controllers/WishlistController");
const OrderController = require("../controllers/OrderController");

// ----- Authentication Routes -----
router.post(
  "/signup",
  [
    body("firstName").notEmpty().withMessage("First name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  UserAuthController.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validateRequest,
  UserAuthController.login
);

router.get("/verify-email", UserAuthController.verifyEmail);
router.post("/resend-verification", UserAuthController.resendVerificationEmail);
router.post("/request-password-reset", UserAuthController.requestPasswordReset);
router.post("/reset-password", UserAuthController.resetPassword);

// ----- Account Management -----
router.get("/profile", ensureAuthenticated, AccountController.getUserProfile);
router.put(
  "/profile",
  ensureAuthenticated,
  AccountController.updateUserProfile
);
router.post("/address", ensureAuthenticated, AccountController.addAddress);
router.put("/address", ensureAuthenticated, AccountController.updateAddress);
router.delete("/address", ensureAuthenticated, AccountController.deleteAddress);

// ----- Cart Management -----
router.post("/cart", ensureAuthenticated, CartController.addToCart);
router.put("/cart", ensureAuthenticated, CartController.updateCartItem);
router.delete("/cart", ensureAuthenticated, CartController.removeCartItem);
router.get("/cart", ensureAuthenticated, CartController.getCart);

// ----- Wishlist Management -----
router.post("/wishlist", ensureAuthenticated, WishlistController.addToWishlist);
router.delete(
  "/wishlist",
  ensureAuthenticated,
  WishlistController.removeFromWishlist
);
router.get("/wishlist", ensureAuthenticated, WishlistController.getWishlist);

// ----- Order Routes -----
router.post("/order", ensureAuthenticated, OrderController.placeOrder);
router.get("/orders", ensureAuthenticated, OrderController.getUserOrders);
router.get(
  "/order/:orderId",
  ensureAuthenticated,
  OrderController.getOrderDetails
);
router.post("/order/cancel", ensureAuthenticated, OrderController.cancelOrder);

module.exports = router;
