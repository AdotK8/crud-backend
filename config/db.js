require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    // Skipping connection to the real database during testing
    return;
  }
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connection successful!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
