import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { sendBadRequest, sendStatus } from "../utils/helpers.mjs";
// import { getDb } from "../db/dbcon.mjs";
import { WorkoutDto, WorkoutModel } from "../models/workout.mjs";
import testworkouts from "../testdata.js";
import mongoose from "mongoose";

//GET
// export const getTestWorkouts: RequestHandler = (req, res) => {
//   try {
//     res.status(200).json(testworkouts);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching workouts",
//       error: (error as Error).message,
//     });
//   }
// };
export const getMongoWorkouts: RequestHandler = async (req, res) => {
  try {
    console.log(
      mongoose.connection.db
        ? `Connected to: ${mongoose.connection.db.databaseName}`
        : "Not connected to a db"
    );

    const workouts = await WorkoutModel.find({});
    const workoutsDTO = workouts.map(
      (workout) =>
        ({
          name: workout.name,
          exercises: workout.exercises.map((exercise) => ({
            name: exercise.name,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight ?? undefined,
          })),
        } satisfies WorkoutDto)
    );
    res.status(200).json(workoutsDTO);
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
      id: uuidv4(),
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
