import express from "express";
import Profile from "../models/Profile.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/profile  (public)
router.get("/", async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  res.json(profile);
});

// PUT /api/profile  (admin)
router.put("/", protect, adminOnly, async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = new Profile();
  Object.assign(profile, req.body);
  await profile.save();
  res.json(profile);
});

export default router;
