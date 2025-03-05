import express from "express";
import {
  getMongoWorkouts,
  getTestWorkouts,
  createMongoWorkout,
  getMongoWorkoutById,
} from "../controllers/workoutController.mjs";

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Workout management
 */

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Get all workouts
 *     tags: [Workouts]
 *     responses:
 *       200:
 *         description: List of all workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new workout
 *     tags: [Workouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - exercises
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the workout
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - reps
 *                     - sets
 *                   properties:
 *                     name:
 *                       type: string
 *                     reps:
 *                       type: number
 *                     sets:
 *                       type: number
 *                     weight:
 *                       type: number
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

const router = express.Router();

router.get("/", getMongoWorkouts);
router.post("/", createMongoWorkout);
// router.get("/", getTestWorkouts);

/**
 * @swagger
 * /workouts/{id}:
 *   get:
 *     summary: Get a workout by ID
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     responses:
 *       200:
 *         description: Workout details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getMongoWorkoutById);

export default router;
