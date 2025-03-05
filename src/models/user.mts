import mongoose, { Document } from "mongoose";
// import { workoutCollection } from "./workout.mjs";
// const userCollection = "user";
interface IUser extends Document {
  username: string;
  password: string;
  userWorkouts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  // Add the method definition here
  toPublicJSON(): {
    _id: mongoose.Types.ObjectId;
    username: string;
    userWorkouts: mongoose.Types.ObjectId[];
  };
}
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
 *         password:
 *           type: string
 *           description: User's password (will be hashed)
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
 *     PublicUser:
 *       type: object
 *       description: User data without sensitive information (returned by toPublicJSON)
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
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
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

userSchema.methods.toPublicJSON = function (this: IUser) {
  return {
    _id: this._id,
    username: this.username,
    // Add any other non-sensitive fields you want to expose
    userWorkouts: this.userWorkouts,
  };
};

export const UserModel = mongoose.model<IUser>("user", userSchema);
