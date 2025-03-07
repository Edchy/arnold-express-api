import { Document, Schema, Types, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IUser extends Document {
  id: string;
  username: string;
  password: string;
  userWorkouts: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  toPublicJSON(): {
    // _id: Types.ObjectId;
    id: string;
    // userWorkouts: Types.ObjectId[];
    username: string;
  };
}

export type Dto = {
  username: string;
};

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

// pre-save hook to generate a UUID for each new user on creation
// runs on save() and create()
// doesnt run on insertMany() unless rawResult option is set to false
// updateOne() and findByIdAndUpdate() dont trigger this middleware
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
