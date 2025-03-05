import mongoose from "mongoose";
// import { workoutCollection } from "./workout.mjs";
// const userCollection = "user";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         username:
 *           type: string
 *           description: The user's unique username
 *         userWorkouts:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of workout IDs associated with the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // We'll add password later when we implement authentication
    userWorkouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workout", // This refers to your workout collection
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("user", userSchema);
