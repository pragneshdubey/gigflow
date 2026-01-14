import Bid from "../models/Bid.model.js";
import Gig from "../models/Gig.model.js";

// ================= PLACE BID =================
export const placeBid = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { amount, message } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Bid amount required" });
    }

    // 1️⃣ Check gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 2️⃣ Only OPEN gigs accept bids
    if (gig.status !== "OPEN") {
      return res.status(400).json({
        message: "This gig is no longer accepting bids",
      });
    }

    // 3️⃣ Owner cannot bid on own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot bid on your own gig",
      });
    }

    // 4️⃣ Prevent duplicate bids
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({
        message: "You have already placed a bid on this gig",
      });
    }

    // 5️⃣ Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,     // ✅ matches schema
      price: amount,                  // ✅ matches schema
      message: message || "Interested in this gig",
      status: "pending",
    });

    res.status(201).json({
      message: "Bid placed successfully",
      bid,
    });
  } catch (error) {
    console.error("PLACE BID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET MY BIDS =================
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate("gigId", "title status budget")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error("GET MY BIDS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET BIDS FOR A GIG =================
export const getBidsForGig = async (req, res) => {
  try {
    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error("GET GIG BIDS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateBidStatus = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { status } = req.body; // ACCEPTED or REJECTED

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const bid = await Bid.findById(bidId).populate("gigId");

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // 🔐 Only gig owner can act
    if (bid.gigId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Accept logic
    if (status === "ACCEPTED") {
      // Reject all bids first
      await Bid.updateMany(
        { gigId: bid.gigId._id },
        { status: "REJECTED" }
      );

      // Accept selected bid
      bid.status = "ACCEPTED";
      await bid.save();

      // Close gig
      bid.gigId.status = "closed";
      await bid.gigId.save();
    } else {
      bid.status = "REJECTED";
      await bid.save();
    }

    res.json({ message: "Bid updated", bid });
  } catch (error) {
    console.error("UPDATE BID STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
