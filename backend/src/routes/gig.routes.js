import express from "express";
import { createGig, getAllGigs } from "../controllers/gig.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllGigs);

// Protected
router.post("/", authMiddleware, createGig);

export default router;
