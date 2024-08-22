require("dotenv").config();

const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
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
