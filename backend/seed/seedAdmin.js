const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const { ROLES } = require("../utils/constants");

dotenv.config();

async function run() {
  try {
    await connectDB();

    const email = "admin@test.com";
    const password = "123456";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("✅ Admin already exists:", email);
      process.exit(0);
    }

    await User.create({
      name: "Admin User",
      email,
      password,
      role: ROLES.ADMIN, // or ROLES.MANAGER
    });

    console.log("✅ Admin created:");
    console.log("email:", email);
    console.log("password:", password);

    process.exit(0);
  } catch (e) {
    console.error("❌ Seed admin failed:", e.message);
    process.exit(1);
  }
}

run();