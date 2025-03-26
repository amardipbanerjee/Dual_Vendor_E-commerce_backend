const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawalRequestSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    bankAccountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalRequest", withdrawalRequestSchema);
