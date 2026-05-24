import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tag: { type: String, default: "" },
    category: { type: String, default: "Full-Stack" },
    description: { type: String, default: "" },
    stack: { type: [String], default: [] },
    features: { type: [String], default: [] },
    image: { type: String, default: "" },
    live: { type: String, default: "" },
    repo: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
