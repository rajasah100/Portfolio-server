import express from "express";
import Project from "../models/Project.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/projects  (public — only published)
router.get("/", async (req, res) => {
  const all = req.query.all === "true";
  const filter = all ? {} : { published: true };
  const items = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  const item = await Project.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Project not found" });
  res.json(item);
});

// POST /api/projects (admin)
router.post("/", protect, adminOnly, async (req, res) => {
  const item = await Project.create(req.body);
  res.status(201).json(item);
});

// PUT /api/projects/:id (admin)
router.put("/:id", protect, adminOnly, async (req, res) => {
  const item = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: "Project not found" });
  res.json(item);
});

// DELETE /api/projects/:id (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project deleted" });
});

export default router;
