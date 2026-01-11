import express from "express";
import { createBid, getBidsForGig, hireBid } from "../controllers/bid.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply to a gig
router.post("/", authMiddleware, createBid);

// View bids for a gig (owner only)
router.get("/:gigId", authMiddleware, getBidsForGig);
router.post("/:bidId/hire", authMiddleware, hireBid);


export default router;
