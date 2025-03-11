import express from "express";
import {
  getMongoWorkouts,
  createMongoWorkout,
  getMongoWorkoutById,
  deleteMongoWorkout,
} from "../controllers/workoutController.mjs";
import { authenticateJWT } from "../middleware/jwt.mjs";

const workoutRouter = express.Router();

workoutRouter.get("/", getMongoWorkouts);
workoutRouter.get("/:id", getMongoWorkoutById);
workoutRouter.post("/", createMongoWorkout);
workoutRouter.delete("/:id", authenticateJWT, deleteMongoWorkout);

export default workoutRouter;
