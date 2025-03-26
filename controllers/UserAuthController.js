const User = require("../models/User");
const passport = require("passport");
const crypto = require("crypto");
const { sendMail } = require("../utils/mailer");

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists." });

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      emailVerificationToken: verificationToken,
    });
    await user.save();

    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify-email?token=${verificationToken}`;
    await sendMail({
      to: email,
      subject: "Email Verification",
      text: `Click this link to verify your email: ${verificationLink}`,
    });

    res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.emailVerified)
      return res.status(400).json({ message: "Email already verified." });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.emailVerificationToken = verificationToken;
    await user.save();

    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify-email?token=${verificationToken}`;
    await sendMail({
      to: email,
      subject: "Resend Email Verification",
      text: `Click this link to verify your email: ${verificationLink}`,
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
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/api/users/reset-password?token=${resetToken}`;
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
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    user.password = newPassword; // Note: hash the password via pre-save middleware ideally
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
