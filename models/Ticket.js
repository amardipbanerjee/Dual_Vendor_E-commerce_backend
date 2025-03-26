const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    raisedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["User", "Seller"],
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    replies: [
      {
        message: { type: String },
        repliedBy: { type: String }, // Could be 'User', 'Seller', or 'Admin'
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
