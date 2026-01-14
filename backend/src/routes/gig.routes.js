import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createGig,
  getAllGigs,
  getGigById,
  getMyGigs,
  updateGig,
  deleteGig
} from "../controllers/gig.controller.js";

const router = express.Router();

router.get("/", getAllGigs);
router.get("/my", authMiddleware, getMyGigs);
router.get("/:id", authMiddleware, getGigById); // 🔥 FIX
router.post("/", authMiddleware, createGig);
router.put("/:id", authMiddleware, updateGig);
router.delete("/:id", authMiddleware, deleteGig);

export default router;