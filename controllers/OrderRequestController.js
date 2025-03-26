const OrderRequest = require("../models/OrderRequest");

exports.createOrderRequest = async (req, res) => {
  try {
    const { order, requestType, details, video } = req.body;
    const orderRequest = new OrderRequest({
      order,
      requestType,
      details,
      video,
    });
    await orderRequest.save();
    res.status(201).json({ message: "Order request created.", orderRequest });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getOrderRequestsForUser = async (req, res) => {
  try {
    // For simplicity, assume user’s orders have been joined; in production, aggregate based on order user
    const orderRequests = await OrderRequest.find({ user: req.user._id });
    res.status(200).json({ orderRequests });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
