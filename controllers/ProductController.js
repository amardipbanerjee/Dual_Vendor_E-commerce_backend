const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  try {
    const seller = req.user._id;
    const {
      title,
      description,
      images,
      dimensions,
      weight,
      category,
      price,
      inventory,
    } = req.body;
    const product = new Product({
      seller,
      title,
      description,
      images,
      dimensions,
      weight,
      category,
      price,
      inventory,
      published: false,
    });
    await product.save();
    res.status(201).json({ message: "Product added.", product });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const seller = req.user._id;
    const { productId, updateData } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: productId, seller },
      updateData,
      { new: true }
    );
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found or not authorized." });
    res.status(200).json({ message: "Product updated.", product });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const seller = req.user._id;
    const { productId } = req.body;
    const product = await Product.findOneAndDelete({ _id: productId, seller });
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found or not authorized." });
    res.status(200).json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.minPrice && req.query.maxPrice) {
      filters.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      };
    }
    if (req.query.rating) filters.rating = { $gte: Number(req.query.rating) };
    if (req.query.search)
      filters.title = { $regex: req.query.search, $options: "i" };

    const products = await Product.find(filters).populate("category");
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate("category");
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
