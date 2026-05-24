import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Profile from "./models/Profile.js";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import Experience from "./models/Experience.js";
import Testimonial from "./models/Testimonial.js";

dotenv.config();

async function run() {
  await connectDB(process.env.MONGO_URI);

  // Admin user
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@raja.dev").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({ email: adminEmail, password: adminPassword, role: "admin" });
    console.log(`✅ Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // Profile (single doc)
  let profile = await Profile.findOne();
  if (!profile) {
    await Profile.create({
      name: "Raja Kumar",
      role: "MERN Stack Developer",
      tagline:
        "I build modern full-stack web applications using MongoDB, Express, React, and Node.js.",
      about:
        "Passionate MERN Stack Developer focused on building scalable, responsive, and user-friendly web applications. Final-year student shipping real projects and looking for internships and freelance work.",
      email: "raja.kumar@example.com",
      location: "Available remotely",
      resumeUrl: "/resume.pdf",
      github: "https://github.com/yourhandle",
      linkedin: "https://linkedin.com/in/yourhandle",
    });
    console.log("✅ Profile seeded");
  }

  // Projects
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany([
      {
        title: "MindHaven",
        tag: "Mental Health Platform",
        category: "Full-Stack",
        description:
          "Journaling, mood tracking, and peer support. Privacy-first auth and a calm UI.",
        stack: ["React", "Node.js", "MongoDB", "Express", "JWT"],
        features: ["Mood journal", "Peer chat", "Encrypted entries", "Therapist directory"],
        live: "https://mindhaven.example.com",
        repo: "https://github.com/yourhandle/mindhaven",
        order: 1,
      }, 
      {
        title: "Cartly",
        tag: "E-Commerce Platform",
        category: "Full-Stack",
        description:
          "Full-stack store with cart, checkout, Stripe payments, and an admin dashboard.",
        stack: ["React", "Redux", "Node.js", "MongoDB", "Stripe"],
        features: ["Auth & roles", "Stripe checkout", "Order history", "Admin dashboard"],
        live: "https://cartly.example.com",
        repo: "https://github.com/yourhandle/cartly",
        order: 2,
      },
      {
        title: "HireGrid",
        tag: "Job Portal",
        category: "Full-Stack",
        description:
          "Two-sided job board with role-based dashboards for recruiters and applicants.",
        stack: ["React", "Tailwind", "Express", "MongoDB"],
        features: ["Recruiter & applicant roles", "Job CRUD", "Saved jobs", "Apply with resume"],
        live: "https://hiregrid.example.com",
        repo: "https://github.com/yourhandle/hiregrid",
        order: 3,
      },
      {
        title: "Quill CMS",
        tag: "Blog & CMS",
        category: "Full-Stack",
        description:
          "Headless-style blog with a rich-text editor, image uploads, and drafts.",
        stack: ["React", "TipTap", "Node.js", "MongoDB", "Cloudinary"],
        features: ["Rich text editor", "Image upload", "Drafts & publish", "SEO meta"],
        live: "https://quill.example.com",
        repo: "https://github.com/yourhandle/quill",
        order: 4,
      },
      {
        title: "Askwell",
        tag: "AI Chat Assistant",
        category: "AI",
        description:
          "Focused chatbot UI on the OpenAI API with streaming and conversation history.",
        stack: ["React", "Node.js", "OpenAI API", "MongoDB"],
        features: ["Streaming replies", "Conversation history", "Prompt library", "Markdown rendering"],
        live: "https://askwell.example.com",
        repo: "https://github.com/yourhandle/askwell",
        order: 5,
      },
    ]);
    console.log("✅ Projects seeded");
  }

  // Skills
  if ((await Skill.countDocuments()) === 0) {
    const skills = [
      ...["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Redux"].map((name, i) => ({
        name,
        category: "Frontend",
        order: i,
      })),
      ...["Node.js", "Express.js", "MongoDB", "JWT Auth", "REST APIs"].map((name, i) => ({
        name,
        category: "Backend",
        order: i,
      })),
      ...["Git", "GitHub", "Postman", "Vercel", "Render"].map((name, i) => ({
        name,
        category: "Tools",
        order: i,
      })),
    ];
    await Skill.insertMany(skills);
    console.log("✅ Skills seeded");
  }

  // Experience
  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany([
      {
        role: "Freelance Full-Stack Developer",
        org: "Self-employed",
        period: "2024 — Present",
        bullets: [
          "Built and shipped MERN applications for small clients.",
          "Owned discovery, design, build, and deploy on Vercel/Render.",
        ],
        order: 1,
      },
      {
        role: "Open Source Contributor",
        org: "GitHub",
        period: "2023 — Present",
        bullets: [
          "Bug fixes and small features in React-based libraries.",
          "Wrote clear PRs and collaborated via code review.",
        ],
        order: 2,
      },
      {
        role: "Final-Year Engineering Student",
        org: "University coursework",
        period: "2022 — Present",
        bullets: [
          "Capstone projects in machine learning and full-stack development.",
          "Presented technical work in viva and design reviews.",
        ],
        order: 3,
      },
    ]);
    console.log("✅ Experience seeded");
  }

  // Testimonials
  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany([
      {
        quote: "Raja shipped our MVP in three weeks. Clean code, clean handoff.",
        name: "Priya S.",
        role: "Founder, indie SaaS",
        approved: true,
        order: 1,
      },
      {
        quote: "Strong fundamentals and a good eye for UI detail.",
        name: "Anil K.",
        role: "Senior Engineer, mentor",
        approved: true,
        order: 2,
      },
    ]);
    console.log("✅ Testimonials seeded");
  }

  console.log("🎉 Seed complete");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
