import express from "express";
import {
  getMongoWorkouts,
  getTestWorkouts,
} from "../controllers/workoutController.mjs";

const router = express.Router();

router.get("/", getMongoWorkouts);
// router.get("/", getTestWorkouts);
// router.post("/", createWorkout);

export default router;
