const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerAddressSchema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
});

const sellerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    // Verification details
    aadharNumber: { type: String },
    panNumber: { type: String },
    gstNumber: { type: String },
    aadharDocument: { type: String },
    panDocument: { type: String },
    gstDocument: { type: String },
    isDocumentsVerified: { type: Boolean, default: false },
    // Seller can add only one address
    address: sellerAddressSchema,
    // Balance could be updated based on orders
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
