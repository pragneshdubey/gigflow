import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  placeBid,
  getBidsForGig,
  getMyBids,
  updateBidStatus
} from "../controllers/bid.controller.js";

const router = express.Router();

// PLACE BID
router.post("/:gigId", authMiddleware, placeBid);

// GET BIDS FOR A GIG
router.get("/gig/:gigId", getBidsForGig);

// GET MY BIDS
router.get("/my", authMiddleware, getMyBids);

router.patch("/:bidId/status", authMiddleware, updateBidStatus);

export default router;
