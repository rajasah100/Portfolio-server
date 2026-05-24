import express from "express";
import multer from "multer";
import { cloudinary, ensureConfigured } from "../config/cloudinary.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

function streamUpload(buffer, folder = "portfolio") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

// POST /api/upload  (admin only) — field name: "image"
router.post("/", protect, adminOnly, upload.single("image"), async (req, res, next) => {
  try {
    ensureConfigured();
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    console.log(`[upload] Receiving ${req.file.originalname} (${req.file.size} bytes)`);
    const result = await streamUpload(req.file.buffer);
    console.log(`[upload] Success → ${result.secure_url}`);

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error("[upload] FAILED:", err.message);
    console.error(err);
    next(err);
  }
});

router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || "Upload failed" });
});

export default router;
