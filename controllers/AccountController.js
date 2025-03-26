const User = require("../models/User");
const Seller = require("../models/Seller");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist")
      .populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updateFields = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "Profile updated.", user });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.addresses.push(req.body);
    await user.save();
    res
      .status(200)
      .json({ message: "Address added.", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId, updateData } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const address = user.addresses.id(addressId);
    if (!address)
      return res.status(404).json({ message: "Address not found." });

    Object.assign(address, updateData);
    await user.save();
    res.status(200).json({ message: "Address updated.", address });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.addresses.id(addressId).remove();
    await user.save();
    res
      .status(200)
      .json({ message: "Address deleted.", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
