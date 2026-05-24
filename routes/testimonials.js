import express from "express";
import Testimonial from "../models/Testimonial.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public: only approved
router.get("/", async (req, res) => {
  const all = req.query.all === "true";
  const filter = all ? {} : { approved: true };
  const items = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

// Public can submit; admin must approve
router.post("/", async (req, res) => {
  const { quote, name, role } = req.body;
  if (!quote || !name) {
    return res.status(400).json({ message: "Quote and name are required" });
  }
  const item = await Testimonial.create({
    quote,
    name,
    role,
    approved: false, // moderation
  });
  res.status(201).json({ message: "Thanks! Submitted for review.", item });
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: "Testimonial not found" });
  res.json(item);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const item = await Testimonial.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Testimonial not found" });
  res.json({ message: "Testimonial deleted" });
});

export default router;
