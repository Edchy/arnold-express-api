import { RequestHandler } from "express";
// import { v4 as uuidv4 } from "uuid";
import { send400 } from "../utils/helpers.mjs";
// import { getDb } from "../db/dbcon.mjs";
import { WorkoutModel } from "../models/workout.mjs";
import testworkouts from "../testdata.js";
import mongoose from "mongoose";

//GET
export const getTestWorkouts: RequestHandler = (req, res) => {
  try {
    res.status(200).json(testworkouts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching workouts",
      error: (error as Error).message,
    });
  }
};
export const getMongoWorkouts: RequestHandler = async (req, res) => {
  try {
    console.log(
      mongoose.connection.db
        ? `Connected to: ${mongoose.connection.db.databaseName}`
        : "Not connected to a db"
    );

    const workouts = await WorkoutModel.find({});
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
// POST
export const createMongoWorkout: RequestHandler = async (req, res) => {
  try {
    const { name, exercises } = req.body;

    // Validate required fields
    if (!name || !Array.isArray(exercises)) {
      send400(res, { message: "Name and exercises array are required" });
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
      send400(res, { message: error.message });
      return;
    }
    res.status(500).json({
      message: "Error creating workout",
      error: (error as Error).message,
    });
  }
};
