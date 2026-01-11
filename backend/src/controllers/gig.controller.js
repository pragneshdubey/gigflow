import Gig from "../models/Gig.model.js";

// CREATE A GIG
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    res.status(201).json({
      message: "Gig created successfully",
      gig
    });
  } catch (error) {
    console.error("CREATE GIG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL OPEN GIGS (+ SEARCH)
export const getAllGigs = async (req, res) => {
  try {
    const search = req.query.search || "";

    const gigs = await Gig.find({
      status: "open",
      title: { $regex: search, $options: "i" }
    }).sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error("GET GIGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
