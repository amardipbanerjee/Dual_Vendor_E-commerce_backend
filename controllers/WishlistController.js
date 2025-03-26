const User = require("../models/User");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.wishlist.includes(productId))
      return res.status(400).json({ message: "Product already in wishlist." });

    user.wishlist.push(productId);
    await user.save();
    res
      .status(200)
      .json({ message: "Product added to wishlist.", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    res.status(200).json({
      message: "Product removed from wishlist.",
      wishlist: user.wishlist,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
