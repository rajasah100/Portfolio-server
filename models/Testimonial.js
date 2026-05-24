import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "" },
    approved: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
