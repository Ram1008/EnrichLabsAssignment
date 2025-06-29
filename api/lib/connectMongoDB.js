import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

const connectMongoDB = async () => {
  mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(() => console.log("▶️  MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
};

export default connectMongoDB;
