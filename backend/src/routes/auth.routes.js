import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route (test)
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

export default router;
