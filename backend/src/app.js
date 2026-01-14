import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
            // local frontend
      "https://gigflow-eosin-nine.vercel.app/", // later
    ],
    credentials: true, // 🔴 REQUIRED FOR COOKIES
  })
);

app.get("/", (req, res) => {
  res.json({ message: "GigFlow API is running 🚀" });
});
// routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

export default app;