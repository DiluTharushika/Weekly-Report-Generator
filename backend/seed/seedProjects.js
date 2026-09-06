const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Project = require("../models/Project");

dotenv.config();

const seedProjects = async () => {
  try {
    await connectDB();

    const projects = [
      { name: "Client A", description: "Client work", color: "#22C55E" },
      { name: "Internal Tooling", description: "Internal tools", color: "#3B82F6" },
      { name: "R&D", description: "Research and prototypes", color: "#A855F7" },
    ];

    // upsert by name (avoid duplicates)
    for (const p of projects) {
      await Project.findOneAndUpdate(
        { name: p.name },
        { $set: p },
        { upsert: true, new: true }
      );
    }

    const count = await Project.countDocuments();
    console.log(`✅ Projects seeded successfully. Total projects: ${count}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed projects failed:", err.message);
    process.exit(1);
  }
};

seedProjects();