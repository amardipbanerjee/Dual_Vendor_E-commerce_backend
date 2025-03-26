const Order = require("../models/Order");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    let totalAmount = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(400).json({ message: "Invalid product in order." });
      totalAmount += product.price * item.quantity;
    }

    // For simplicity, assume one seller per order (in production, orders might be split per seller)
    const seller = items[0].seller;

    const order = new Order({
      user: req.user._id,
      seller,
      items,
      totalAmount,
      status: "Placed",
    });
    await order.save();

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.product"
    );
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // Simulate cancellation request creation (in production, check timeframe before allowing cancellation)
    order.status = "CancellationRequested";
    await order.save();
    res.status(200).json({ message: "Cancellation request created.", order });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
