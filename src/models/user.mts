import { Document, Schema, Types, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Workout } from "./workout.mjs";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: UUID of the user (auto-generated)
 *         username:
 *           type: string
 *           description: User's unique username
 *         password:
 *           type: string
 *           description: User's hashed password
 *           format: password
 *         userWorkouts:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of workout ObjectIds linked to this user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *       example:
 *         id: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         username: johndoe
 *         userWorkouts: ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"]
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *     PublicUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: UUID of the user
 *         username:
 *           type: string
 *           description: User's username
 *       example:
 *         id: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         username: johndoe
 */

interface IUser extends Document {
  id: string;
  username: string;
  password: string;
  userWorkouts: Types.ObjectId[] | Workout[];

  /**
   * @swagger
   * components:
   *   schemas:
   *     toPublicJSON:
   *       description: Method to expose only public fields of a user
   */
  toPublicJSON(): {
    // _id: Types.ObjectId;
    id: string;
    // userWorkouts: Types.ObjectId[];
    username: string;
  };
}

const userSchema = new Schema(
  {
    id: {
      type: String,
    },
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
        type: Schema.Types.ObjectId,
        ref: "workout", // reference to the workout model (collection)
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreSaveHook:
 *       description: |
 *         Pre-save hook to generate a UUID for each new user.
 *         Runs on save() and create(), but not on insertMany() unless rawResult=false.
 *         Not triggered by updateOne() or findByIdAndUpdate().
 */
userSchema.pre("save", function (this: IUser, next) {
  if (this.isNew) {
    this.id = uuidv4();
  }
  next();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UserToPublicJSON:
 *       description: |
 *         Method to convert a user document to a public-safe JSON object.
 *         Returns only non-sensitive fields (username and id).
 */
userSchema.methods.toPublicJSON = function (this: IUser) {
  return {
    // Add exposable fields here
    username: this.username,
    // _id: this._id,
    id: this.id,
    // userWorkouts: this.userWorkouts,
  };
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UserModel:
 *       description: Mongoose model for User documents
 */
export const UserModel = model<IUser>("user", userSchema);
