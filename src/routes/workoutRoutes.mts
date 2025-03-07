import express from "express";
import {
  getMongoWorkouts,
  // getTestWorkouts,
  createMongoWorkout,
  getMongoWorkoutById,
} from "../controllers/workoutController.mjs";

const workoutRouter = express.Router();

workoutRouter.get("/", getMongoWorkouts);
workoutRouter.post("/", createMongoWorkout);
// workoutRouter.get("/", getTestWorkouts);
workoutRouter.get("/:id", getMongoWorkoutById);

export default workoutRouter;
