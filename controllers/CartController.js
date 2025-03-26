const User = require("../models/User");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    res
      .status(200)
      .json({ message: "Product added to cart.", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1)
      return res.status(404).json({ message: "Product not in cart." });

    user.cart[itemIndex].quantity = quantity;
    await user.save();
    res.status(200).json({ message: "Cart updated.", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );
    await user.save();
    res
      .status(200)
      .json({ message: "Item removed from cart.", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
