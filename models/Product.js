const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }], // Expect 3 images ideally (validation can be added)
    dimensions: {
      height: { type: Number },
      width: { type: Number },
      length: { type: Number },
    },
    weight: { type: Number }, // in grams
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    inventory: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
