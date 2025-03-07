import mongoose from "mongoose";

// Data Transfer Object (DTO)
export type WorkoutDto = {
  name: string;
  exercises: {
    name: string;
    reps: number;
    sets: number;
    weight?: number;
  }[];
};

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
    weight: {
      type: Number,
      required: true,
    },
  },
  { _id: false, strict: true }
);

const workoutSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: false,
    },
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

export const WorkoutModel = mongoose.model("workout", workoutSchema);
