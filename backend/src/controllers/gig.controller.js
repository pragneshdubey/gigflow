import Gig from "../models/Gig.model.js";

// ================= CREATE GIG =================
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
      ownerId: req.user._id,
      status: "OPEN", // ✅ CONSISTENT ENUM
    });

    res.status(201).json(gig);
  } catch (error) {
    console.error("CREATE GIG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL GIGS =================
export const getAllGigs = async (req, res) => {
  try {
    const search = req.query.search || "";

    const gigs = await Gig.find({
      status: "OPEN", // ✅ FIXED
      title: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error("GET ALL GIGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET MY GIGS =================
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error("GET MY GIGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET SINGLE GIG =================
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 🔥 ADD THIS (VERY IMPORTANT)
    const gigObj = gig.toObject();
    gigObj.isOwner =
      gig.ownerId.toString() === req.user._id.toString();

    res.json(gigObj);
  } catch (error) {
    console.error("GET GIG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE GIG =================
export const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      req.body,
      { new: true }
    );

    if (!gig) {
      return res
        .status(404)
        .json({ message: "Gig not found or unauthorized" });
    }

    res.json(gig);
  } catch (error) {
    console.error("UPDATE GIG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE GIG =================
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user._id,
    });

    if (!gig) {
      return res
        .status(404)
        .json({ message: "Gig not found or unauthorized" });
    }

    res.json({ message: "Gig deleted successfully" });
  } catch (error) {
    console.error("DELETE GIG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};