import mongoose from "mongoose";

const collectionName = "workout";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
  },
  { _id: false, strict: true }
);

const workoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    exercises: [exerciseSchema],
  },
  {
    timestamps: true,
  }
);

export const WorkoutModel = mongoose.model(collectionName, workoutSchema);
