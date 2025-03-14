import { Document, Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     ExerciseDto:
 *       type: object
 *       required:
 *         - name
 *         - reps
 *         - sets
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the exercise
 *         reps:
 *           type: number
 *           description: Number of repetitions
 *         sets:
 *           type: number
 *           description: Number of sets
 *         weight:
 *           type: number
 *           description: Weight in kg (optional)
 *       example:
 *         name: Bench Press
 *         reps: 8
 *         sets: 3
 *         weight: 100
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkoutDto:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - exercises
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB id of the workout
 *         name:
 *           type: string
 *           description: Name of the workout
 *         megaChadThatCreatedThisMasterpiece:
 *           type: string
 *           description: Username of the workout creator
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExerciseDto'
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         name: Full Body Workout
 *         megaChadThatCreatedThisMasterpiece: john_doe
 *         exercises:
 *           - name: Push-ups
 *             reps: 10
 *             sets: 3
 *           - name: Squats
 *             reps: 12
 *             sets: 3
 *             weight: 50
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - name
 *         - reps
 *         - sets
 *         - weight
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the exercise
 *         reps:
 *           type: number
 *           description: Number of repetitions
 *         sets:
 *           type: number
 *           description: Number of sets
 *         weight:
 *           type: number
 *           description: Weight in kg
 */

// Mongoose Document Types
export interface Exercise extends Document {
  name: string;
  reps: number;
  sets: number;
  weight?: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       required:
 *         - name
 *         - exercises
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB id of the workout
 *         name:
 *           type: string
 *           description: Name of the workout
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *         isDefault:
 *           type: boolean
 *           description: Whether this is a default workout
 *         createdBy:
 *           type: string
 *           description: Username of the workout creator
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         name: Full Body Workout
 *         exercises:
 *           - name: Push-ups
 *             reps: 10
 *             sets: 3
 *             weight: 0
 *           - name: Squats
 *             reps: 12
 *             sets: 3
 *             weight: 50
 *         isDefault: false
 *         createdBy: john_doe
 *         createdAt: 2023-06-21T12:00:00.000Z
 *         updatedAt: 2023-06-21T12:00:00.000Z
 */

export interface Workout extends Document {
  _id: string;
  name: string;
  exercises: Exercise[];
  isDefault: boolean;
  createdBy: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     WorkoutTransformFunction:
 *       description: Transforms a Workout document to a WorkoutDto
 */
export const transformToWorkoutDto = (workouts: Workout[]): WorkoutDto[] => {
  return workouts.map((workout) => ({
    _id: workout._id.toString(),
    name: workout.name,
    megaChadThatCreatedThisMasterpiece: workout.createdBy,
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
    createdBy: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field when a workout is modified
workoutSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() });
});

export const WorkoutModel = model<Workout>("workout", workoutSchema);
