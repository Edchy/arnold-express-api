import express from "express";
import {
  getMongoWorkouts,
  createMongoWorkout,
  getMongoWorkoutById,
  deleteMongoWorkout,
  updateMongoWorkout,
} from "../controllers/workoutController.mjs";
import { authenticateJWT } from "../middleware/jwt.mjs";

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Workout management endpoints
 */

const workoutRouter = express.Router();

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Get all workouts
 *     tags: [Workouts]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search for exercises by name
 *     responses:
 *       200:
 *         description: List of workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkoutDto'
 *       500:
 *         description: Server error
 */
workoutRouter.get("/", getMongoWorkouts);

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
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Workout details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutDto'
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Server error
 */
workoutRouter.get("/:id", getMongoWorkoutById);

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Create a new workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
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
 *                       description: Name of the exercise
 *                     reps:
 *                       type: number
 *                       description: Number of repetitions
 *                     sets:
 *                       type: number
 *                       description: Number of sets
 *                     weight:
 *                       type: number
 *                       description: Weight in kg (optional)
 *               isDefault:
 *                 type: boolean
 *                 description: Whether this is a default workout
 *                 default: false
 *             example:
 *               name: Upper Body Workout
 *               exercises:
 *                 - name: Push-ups
 *                   reps: 10
 *                   sets: 3
 *                   weight: 0
 *                 - name: Pull-ups
 *                   reps: 8
 *                   sets: 3
 *                   weight: 0
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
workoutRouter.post("/", authenticateJWT, createMongoWorkout);

/**
 * @swagger
 * /workouts/{id}:
 *   delete:
 *     summary: Delete a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Workout deleted successfully or removed from user's collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Workout deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Server error
 */
workoutRouter.delete("/:id", authenticateJWT, deleteMongoWorkout);

/**
 * @swagger
 * /workouts/{id}:
 *   put:
 *     summary: Update a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the workout
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the exercise
 *                     reps:
 *                       type: number
 *                       description: Number of repetitions
 *                     sets:
 *                       type: number
 *                       description: Number of sets
 *                     weight:
 *                       type: number
 *                       description: Weight in kg
 *             example:
 *               name: Updated Workout
 *               exercises:
 *                 - name: Bench Press
 *                   reps: 12
 *                   sets: 4
 *                   weight: 80
 *                 - name: Tricep Extensions
 *                   reps: 15
 *                   sets: 3
 *                   weight: 30
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Server error
 */
workoutRouter.put("/:id", authenticateJWT, updateMongoWorkout);

export default workoutRouter;
