import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { sendBadRequest, sendStatus } from "../utils/helpers.mjs";
// import { getDb } from "../db/dbcon.mjs";
import {
  transformToWorkoutDto,
  WorkoutDto,
  WorkoutModel,
} from "../models/workout.mjs";
import mongoose from "mongoose";
import { UserModel } from "../models/user.mjs";

export const getMongoWorkouts: RequestHandler = async (_, res) => {
  try {
    console.log(
      mongoose.connection.db
        ? `Connected to: ${mongoose.connection.db.databaseName}`
        : "Not connected to a db"
    );

    const workouts = await WorkoutModel.find({});
    res.status(200).json(transformToWorkoutDto(workouts));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
// GET by ID
export const getMongoWorkoutById: RequestHandler = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const workout = await WorkoutModel.findById(workoutId);

    if (!workout) {
      res.status(404).json({ message: "Workout not found" });
      return;
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({
      message: "Error finding workout",
      error: (error as Error).message,
    });
  }
};
// POST
export const createMongoWorkout: RequestHandler = async (req, res) => {
  try {
    const { name, exercises } = req.body;

    // Validate required fields
    if (!name || !Array.isArray(exercises)) {
      sendBadRequest(res, { message: "Name and exercises array are required" });
      return;
    }

    // Create new workout document
    const newWorkout = new WorkoutModel({
      name,
      exercises,
    });

    // Save to database
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);

    // Create and save in one step
    // const savedWorkout = await WorkoutModel.create({
    //   name,
    //   exercises,
    // });

    if (mongoose.connection.db) {
      console.log(`Saving to database: ${mongoose.connection.db.databaseName}`);
      console.log(`Saving to collection: ${WorkoutModel.collection.name}`);
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      sendBadRequest(res, { message: error.message });
      return;
    }
    res.status(500).json({
      message: "Error creating workout",
      error: (error as Error).message,
    });
  }
};

export const deleteMongoWorkout: RequestHandler = async (req, res) => {
  console.log("Request user:", req.user);
  const workoutId = req.params.id;
  const userId = req.user.userId; // From JWT
  const workoutObjectId = new mongoose.Types.ObjectId(workoutId);

  console.log("User ID:", userId);
  console.log("Workout ID:", workoutId);

  try {
    // Find the workout
    const workout = await WorkoutModel.findById(workoutId);

    if (!workout) {
      res.status(404).json({ message: "Workout not found" });
      return;
    }

    // Find the user and remove the workout reference
    await UserModel.findOneAndUpdate(
      { id: userId },
      {
        $pull: { userWorkouts: workoutId },
      }
    );

    // Delete the workout document
    await WorkoutModel.findByIdAndDelete(workoutId);

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete workout",
      error: (error as Error).message,
    });
  }
};
