const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // ✅ Success message
    console.log("======================================");
    console.log("✅ MongoDB CONNECTED SUCCESSFULLY");
    console.log(`Host: ${conn.connection.host}`);
    console.log(`DB  : ${conn.connection.name}`);
    console.log("======================================");

    // Optional: extra events (helps debugging)
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("❌ MongoDB runtime error:", err.message);
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;