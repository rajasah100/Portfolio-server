// Run: node check-cloudinary.js (from server folder)
// Yo script .env load garcha ra Cloudinary credentials test garcha

import dotenv from "dotenv";
dotenv.config();

console.log("\n=== Cloudinary Env Check ===");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ MISSING");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ set" : "❌ MISSING");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ set" : "❌ MISSING");

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("\n❌ One or more Cloudinary env vars missing in server/.env");
  process.exit(1);
}

const { v2: cloudinary } = await import("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

try {
  const result = await cloudinary.api.ping();
  console.log("\n✅ Cloudinary connection works:", result);
} catch (err) {
  console.error("\n❌ Cloudinary connection FAILED:", err.message);
  console.error("   → Check Cloud Name / API Key / API Secret are correct on Cloudinary dashboard");
  process.exit(1);
}
