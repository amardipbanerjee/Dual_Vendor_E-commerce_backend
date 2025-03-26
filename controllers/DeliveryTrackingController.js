exports.trackOrder = async (req, res) => {
  try {
    const { trackingId } = req.query;
    // Simulate calling a delivery partner API (e.g., XpressBees) with the trackingId
    res.status(200).json({
      message: "Tracking info fetched.",
      trackingData: {
        trackingId,
        status: "In transit",
        estimatedDelivery: "2025-04-01",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
