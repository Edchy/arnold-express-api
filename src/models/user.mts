import mongoose from "mongoose";

// Create a simple user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // We'll add password later when we implement authentication
    // workouts: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "workout", // This refers to your workout collection
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("user", userSchema);
