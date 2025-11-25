// config/db.js
import mongoose from "mongoose";

let isConnected = false; // cached connection

const connectDB = async () => {
  if (isConnected) {
    console.log("🔵 MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "booknstay", // ensure DB name here
    });
    isConnected = true;
    console.log("🟢 MongoDB Connected");
  } catch (err) {
    console.log("🔴 MongoDB connection error:", err);
  }
};

export default connectDB;
