import express from "express";
import {
  getMongoWorkouts,
  getTestWorkouts,
  createMongoWorkout,
} from "../controllers/workoutController.mjs";

const router = express.Router();

router.get("/", getMongoWorkouts);
// router.get("/", getTestWorkouts);
router.post("/", createMongoWorkout);

export default router;
