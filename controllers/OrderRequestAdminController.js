const OrderRequest = require("../models/OrderRequest");

exports.getAllOrderRequests = async (req, res) => {
  try {
    const requests = await OrderRequest.find();
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateOrderRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const allowedStatuses = ["Approved", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const request = await OrderRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
    if (!request)
      return res.status(404).json({ message: "Request not found." });
    res.status(200).json({ message: "Request updated.", request });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
