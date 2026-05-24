import express from "express";
import Experience from "../models/Experience.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await Experience.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post("/", protect, adminOnly, async (req, res) => {
  const item = await Experience.create(req.body);
  res.status(201).json(item);
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const item = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: "Experience not found" });
  res.json(item);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const item = await Experience.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Experience not found" });
  res.json({ message: "Experience deleted" });
});

export default router;
