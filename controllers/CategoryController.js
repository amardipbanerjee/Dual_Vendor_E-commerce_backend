const Category = require("../models/Category");

exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: "Category added.", category });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId, updateData } = req.body;
    const category = await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found." });
    res.status(200).json({ message: "Category updated.", category });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found." });
    res.status(200).json({ message: "Category deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
