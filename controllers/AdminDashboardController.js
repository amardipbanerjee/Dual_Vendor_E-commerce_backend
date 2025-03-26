// controllers/AdminDashboardController.js
const Order = require("../models/Order");
const OrderRequest = require("../models/OrderRequest");
const User = require("../models/User");
const Seller = require("../models/Seller");
const Ticket = require("../models/Ticket");

exports.getDashboardStats = async (req, res) => {
  try {
    // Total orders count
    const totalOrders = await Order.countDocuments();

    // Calculate total sales from delivered orders
    const deliveredOrdersAgg = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const totalSales =
      deliveredOrdersAgg.length > 0 ? deliveredOrdersAgg[0].totalSales : 0;

    // Count of cancellation, return, and replacement requests
    const cancellationCount = await OrderRequest.countDocuments({
      requestType: "Cancellation",
    });
    const returnCount = await OrderRequest.countDocuments({
      requestType: "Return",
    });
    const replacementCount = await OrderRequest.countDocuments({
      requestType: "Replacement",
    });

    // Count users and sellers
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments();

    // Count active sellers (verified and not restricted) and inactive sellers
    const activeSellers = await Seller.countDocuments({
      isDocumentsVerified: true,
      restricted: { $ne: true },
    });
    const inactiveSellers = totalSellers - activeSellers;

    // Count tickets (support requests)
    const totalTickets = await Ticket.countDocuments();

    // Compose the statistics object
    const stats = {
      totalOrders,
      totalSales,
      cancellationCount,
      returnCount,
      replacementCount,
      totalUsers,
      totalSellers,
      activeSellers,
      inactiveSellers,
      totalTickets,
    };

    return res.status(200).json({ stats });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching dashboard stats." });
  }
};
