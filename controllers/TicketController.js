const Ticket = require("../models/Ticket");

exports.createTicket = async (req, res) => {
  try {
    const raisedBy = req.user._id;
    const onModel = req.user.role; // 'User' or 'Seller'
    const { subject, message } = req.body;
    const ticket = new Ticket({ raisedBy, onModel, subject, message });
    await ticket.save();
    res.status(201).json({ message: "Ticket created.", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.addTicketReply = async (req, res) => {
  try {
    const { ticketId, message } = req.body;
    const repliedBy = req.user.role; // 'User', 'Seller', or 'Admin'
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    ticket.replies.push({ message, repliedBy });
    await ticket.save();
    res.status(200).json({ message: "Reply added.", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === "Admin") {
      tickets = await Ticket.find();
    } else {
      tickets = await Ticket.find({ raisedBy: req.user._id });
    }
    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
