const WithdrawalRequest = require("../models/WithdrawalRequest");

exports.createWithdrawalRequest = async (req, res) => {
  try {
    const { bankAccountHolderName, bankName, accountNumber, ifscCode, amount } =
      req.body;
    const withdrawalRequest = new WithdrawalRequest({
      seller: req.user._id,
      bankAccountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      amount,
    });
    await withdrawalRequest.save();
    res
      .status(201)
      .json({ message: "Withdrawal request created.", withdrawalRequest });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getWithdrawalRequests = async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({ seller: req.user._id });
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
