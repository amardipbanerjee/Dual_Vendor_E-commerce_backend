const Ticket = require("../models/Ticket");

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId, status } = req.body;
    if (!["Open", "Closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    res.status(200).json({ message: "Ticket status updated.", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
