import express from "express";
import Skill from "../models/Skill.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await Skill.find().sort({ category: 1, order: 1, name: 1 });
  res.json(items);
});

router.post("/", protect, adminOnly, async (req, res) => {
  const item = await Skill.create(req.body);
  res.status(201).json(item);
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const item = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: "Skill not found" });
  res.json(item);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const item = await Skill.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Skill not found" });
  res.json({ message: "Skill deleted" });
});

export default router;
