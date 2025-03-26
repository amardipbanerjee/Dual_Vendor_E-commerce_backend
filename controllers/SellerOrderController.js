const Order = require("../models/Order");

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id }).populate(
      "items.product"
    );
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const allowedStatuses = ["Accepted", "Rejected", "Packaged", "Shipped"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const order = await Order.findOneAndUpdate(
      { _id: orderId, seller: req.user._id },
      { status },
      { new: true }
    );
    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized." });
    res.status(200).json({ message: "Order status updated.", order });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
