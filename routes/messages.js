import express from "express";
import Message from "../models/Message.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public submit
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }
  const item = await Message.create({ name, email, subject, message });
  res.status(201).json({ message: "Message received", item });
});

// Admin only
router.get("/", protect, adminOnly, async (req, res) => {
  const items = await Message.find().sort({ createdAt: -1 });
  res.json(items);
});

router.patch("/:id/read", protect, adminOnly, async (req, res) => {
  const item = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Message not found" });
  res.json(item);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const item = await Message.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Message not found" });
  res.json({ message: "Message deleted" });
});

export default router;
