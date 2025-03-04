import mongoose from "mongoose";
import { getMongoURI } from "../utils/helpers.mjs";

export default async function connectToMongoDB(): Promise<void> {
  try {
    await mongoose.connect(getMongoURI());
    console.log("Connected to MongoDB using Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
