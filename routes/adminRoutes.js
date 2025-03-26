// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { ensureAuthenticated } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");
const validateRequest = require("../middlewares/validateRequest");

// Import controllers
const AdminAuthController = require("../controllers/AdminAuthController");
const AdminDashboardController = require("../controllers/AdminDashboardController");
const SellerManagementController = require("../controllers/SellerManagementController");
const OrderRequestAdminController = require("../controllers/OrderRequestAdminController");
const TicketManagementController = require("../controllers/TicketManagementController");

// ----- Admin Authentication -----
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validateRequest,
  AdminAuthController.login
);

// ----- Protect all routes beyond this point for Admins only -----
router.use(ensureAuthenticated, checkRole(["Admin"]));

// ----- Dashboard & Reporting -----
router.get("/dashboard", AdminDashboardController.getDashboardStats);

// ----- Seller Management -----
router.get("/sellers", SellerManagementController.getAllSellers);
router.post("/seller/verify", SellerManagementController.verifySeller);
router.post("/seller/restrict", SellerManagementController.restrictSeller);
router.delete("/seller", SellerManagementController.deleteSeller);

// ----- Order Request Management -----
router.get("/order-requests", OrderRequestAdminController.getAllOrderRequests);
router.put(
  "/order-request",
  OrderRequestAdminController.updateOrderRequestStatus
);

// ----- Ticket Management -----
router.get("/tickets", TicketManagementController.getAllTickets);
router.put("/ticket/status", TicketManagementController.updateTicketStatus);

module.exports = router;
