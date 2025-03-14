import express from "express";
import {
  getMongoWorkouts,
  createMongoWorkout,
  getMongoWorkoutById,
  deleteMongoWorkout,
  updateMongoWorkout,
} from "../controllers/workoutController.mjs";
import { authenticateJWT } from "../middleware/jwt.mjs";

const workoutRouter = express.Router();

workoutRouter.get("/", getMongoWorkouts);
workoutRouter.get("/:id", getMongoWorkoutById);
workoutRouter.post("/", authenticateJWT, createMongoWorkout);
workoutRouter.delete("/:id", authenticateJWT, deleteMongoWorkout);
workoutRouter.put("/:id", authenticateJWT, updateMongoWorkout);

export default workoutRouter;
