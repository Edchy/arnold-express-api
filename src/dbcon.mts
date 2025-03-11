import { connect } from "mongoose";
import { getMongoURI } from "./utils/helpers.mjs";
import mongoose from "mongoose";

export default async function connectToMongoDB(): Promise<void> {
  mongoose.connection.on("disconnected", () => {
    console.log("Lost MongoDB connection. Attempting to reconnect...");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  try {
    await connect(getMongoURI());
    console.log("Connected to MongoDB using Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
