const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderRequestSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    requestType: {
      type: String,
      enum: ["Return", "Replacement", "Cancellation"],
      required: true,
    },
    details: { type: String },
    video: { type: String }, // URL for the uploaded video (for return requests)
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderRequest", orderRequestSchema);
