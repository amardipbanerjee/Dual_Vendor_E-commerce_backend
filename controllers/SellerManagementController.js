const Seller = require("../models/Seller");

exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json({ sellers });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.verifySeller = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { isDocumentsVerified: true },
      { new: true }
    );
    if (!seller) return res.status(404).json({ message: "Seller not found." });
    res.status(200).json({ message: "Seller verified.", seller });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.restrictSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { restricted: true },
      { new: true }
    );
    if (!seller) return res.status(404).json({ message: "Seller not found." });
    res.status(200).json({ message: "Seller restricted.", seller });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const seller = await Seller.findByIdAndDelete(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found." });
    res.status(200).json({ message: "Seller account deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
