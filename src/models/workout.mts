import mongoose from "mongoose";

// export const workoutCollection = "workout";

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
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the exercise
 *         reps:
 *           type: number
 *           description: Number of repetitions
 *         sets:
 *           type: number
 *           description: Number of sets
 *         weight:
 *           type: number
 *           description: Weight used (optional)
 *
 *     Workout:
 *       type: object
 *       required:
 *         - name
 *         - exercises
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: The name of the workout
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *           description: List of exercises in this workout
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the workout was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the workout was last updated
 */

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
      required: false,
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

export const WorkoutModel = mongoose.model("workout", workoutSchema);
