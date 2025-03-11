import { Document, Schema, model } from "mongoose";

// Data Transfer Object (DTO)
export type WorkoutDto = {
  _id: string;
  name: string;
  exercises: {
    name: string;
    reps: number;
    sets: number;
    weight?: number;
  }[];
};

// Mongoose Document Types
export interface Exercise extends Document {
  name: string;
  reps: number;
  sets: number;
  weight?: number;
}

export interface Workout extends Document {
  _id: string;
  name: string;
  exercises: Exercise[];
  isDefault: boolean;
}

export const transformToWorkoutDto = (workouts: Workout[]): WorkoutDto[] => {
  return workouts.map((workout) => ({
    _id: workout._id.toString(),
    name: workout.name,
    exercises: workout.exercises.map((exercise: Exercise) => ({
      name: exercise.name,
      reps: exercise.reps,
      sets: exercise.sets,
      weight: exercise.weight ?? undefined,
    })),
  }));
};

const exerciseSchema = new Schema<Exercise>(
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

const workoutSchema = new Schema<Workout>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    exercises: [exerciseSchema],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkoutModel = model<Workout>("workout", workoutSchema);
