const Seller = require("../models/Seller");

exports.getBalanceDetails = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user._id);
    if (!seller) return res.status(404).json({ message: "Seller not found." });
    res.status(200).json({ balance: seller.balance });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
