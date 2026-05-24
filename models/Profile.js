import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Raja Kumar" },
    role: { type: String, default: "MERN Stack Developer" },
    tagline: { type: String, default: "" },
    about: { type: String, default: "" },
    email: { type: String, default: "" },
    location: { type: String, default: "" },
    resumeUrl: { type: String, default: "/resume.pdf" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
