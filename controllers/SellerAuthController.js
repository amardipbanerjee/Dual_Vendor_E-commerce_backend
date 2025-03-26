const Seller = require("../models/Seller");
const passport = require("passport");
const crypto = require("crypto");
const { sendMail } = require("../utils/mailer");

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      aadharNumber,
      panNumber,
      gstNumber,
    } = req.body;
    let seller = await Seller.findOne({ email });
    if (seller)
      return res.status(400).json({ message: "Seller already exists." });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    seller = new Seller({
      firstName,
      lastName,
      email,
      phone,
      password,
      emailVerificationToken: verificationToken,
      aadharNumber,
      panNumber,
      gstNumber,
    });
    await seller.save();

    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/sellers/verify-email?token=${verificationToken}`;
    await sendMail({
      to: email,
      subject: "Email Verification",
      text: `Verify your email using this link: ${verificationLink}`,
    });

    res
      .status(201)
      .json({ message: "Seller registered. Please verify your email." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("local-seller", (err, seller, info) => {
    if (err) return next(err);
    if (!seller) return res.status(400).json({ message: info.message });
    req.login(seller, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "Login successful", seller });
    });
  })(req, res, next);
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const seller = await Seller.findOne({ emailVerificationToken: token });
    if (!seller)
      return res.status(400).json({ message: "Invalid or expired token." });

    seller.emailVerified = true;
    seller.emailVerificationToken = undefined;
    await seller.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ message: "Seller not found." });
    if (seller.emailVerified)
      return res.status(400).json({ message: "Email already verified." });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    seller.emailVerificationToken = verificationToken;
    await seller.save();

    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/sellers/verify-email?token=${verificationToken}`;
    await sendMail({
      to: email,
      subject: "Resend Email Verification",
      text: `Verify your email using this link: ${verificationLink}`,
    });

    res
      .status(200)
      .json({ message: "Verification email resent successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ message: "Seller not found." });

    const resetToken = crypto.randomBytes(20).toString("hex");
    seller.resetPasswordToken = resetToken;
    seller.resetPasswordExpires = Date.now() + 3600000;
    await seller.save();

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/api/sellers/reset-password?token=${resetToken}`;
    await sendMail({
      to: email,
      subject: "Password Reset",
      text: `Reset your password using this link: ${resetLink}`,
    });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const seller = await Seller.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!seller)
      return res.status(400).json({ message: "Invalid or expired token." });

    seller.password = newPassword;
    seller.resetPasswordToken = undefined;
    seller.resetPasswordExpires = undefined;
    await seller.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
