const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Placed",
        "Accepted",
        "Rejected",
        "Packaged",
        "Shipped",
        "Delivered",
        "Cancelled",
        "ReturnRequested",
        "ReplacementRequested",
      ],
      default: "Placed",
    },
    trackingId: { type: String },
    deliveryPartner: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
