import mongoose from "mongoose";
import Bid from "../models/Bid.model.js";
import Gig from "../models/Gig.model.js";

/* =======================
   CREATE BID (Apply)
======================= */
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot bid on your own gig" });
    }

    if (gig.status !== "open") {
      return res.status(400).json({ message: "Gig is not open for bidding" });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({ message: "You already applied to this gig" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    res.status(201).json({
      message: "Bid submitted successfully",
      bid
    });
  } catch (error) {
    console.error("CREATE BID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   GET BIDS (Owner Only)
======================= */
export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gigId }).populate(
      "freelancerId",
      "name email"
    );

    res.json(bids);
  } catch (error) {
    console.error("GET BIDS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   HIRE BID (FINAL STEP)
======================= */
export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { bidId } = req.params;

    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not authorized to hire" });
    }

    if (gig.status !== "open") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Gig already assigned" });
    }

    // Hire selected bid
    bid.status = "hired";
    await bid.save({ session });

    // Reject all other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    // Mark gig as assigned
    gig.status = "assigned";
    await gig.save({ session });

    await session.commitTransaction();

    res.json({
      message: "Freelancer hired successfully",
      hiredBid: bid
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("HIRE BID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
};
