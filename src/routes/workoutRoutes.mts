import express from "express";
import {
  getMongoWorkouts,
  getTestWorkouts,
  createMongoWorkout,
} from "../controllers/workoutController.mjs";

const router = express.Router();

router.get("/", getMongoWorkouts);
router.post("/", createMongoWorkout);
// router.get("/", getTestWorkouts);

export default router;
