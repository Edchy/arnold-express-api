import { Document, Schema, Types, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Workout } from "./workout.mjs";

interface IUser extends Document {
  id: string;
  username: string;
  password: string;
  userWorkouts: Types.ObjectId[] | Workout[];
  createdAt: Date;
  updatedAt: Date;

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

// pre-save hook för att generera ett UUID för varje ny användare vid skapande
// körs på save() och create()
// körs inte på insertMany() om inte rawResult-alternativet är satt till false
// updateOne() och findByIdAndUpdate() triggar inte denna middleware
userSchema.pre("save", function (this: IUser, next) {
  if (this.isNew) {
    this.id = uuidv4();
  }
  next();
});

// Method to expose only the public fields of a user
userSchema.methods.toPublicJSON = function (this: IUser) {
  return {
    // Add exposable fields here
    username: this.username,
    // _id: this._id,
    id: this.id,
    // userWorkouts: this.userWorkouts,
  };
};

export const UserModel = model<IUser>("user", userSchema);
