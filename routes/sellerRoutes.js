// routes/sellerRoutes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { ensureAuthenticated } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");
const validateRequest = require("../middlewares/validateRequest");

// Import controllers
const SellerAuthController = require("../controllers/SellerAuthController");
const ProductController = require("../controllers/ProductController");
const SellerOrderController = require("../controllers/SellerOrderController");
const WithdrawalController = require("../controllers/WithdrawalController");
const SellerBalanceController = require("../controllers/SellerBalanceController");

// ----- Seller Authentication Routes -----
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
  SellerAuthController.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validateRequest,
  SellerAuthController.login
);

router.get("/verify-email", SellerAuthController.verifyEmail);
router.post(
  "/resend-verification",
  SellerAuthController.resendVerificationEmail
);
router.post(
  "/request-password-reset",
  SellerAuthController.requestPasswordReset
);
router.post("/reset-password", SellerAuthController.resetPassword);

// ----- Protect all routes beyond this point for Sellers only -----
router.use(ensureAuthenticated, checkRole(["Seller"]));

// ----- Product Management -----
router.post("/product", ProductController.addProduct);
router.put("/product", ProductController.updateProduct);
router.delete("/product", ProductController.deleteProduct);
router.get("/products", ProductController.getProducts);
router.get("/product/:productId", ProductController.getProductById);

// ----- Seller Order Management -----
router.get("/orders", SellerOrderController.getSellerOrders);
router.put("/order/status", SellerOrderController.updateOrderStatus);

// ----- Financial Routes -----
router.post("/withdrawal", WithdrawalController.createWithdrawalRequest);
router.get("/withdrawals", WithdrawalController.getWithdrawalRequests);
router.get("/balance", SellerBalanceController.getBalanceDetails);

module.exports = router;
