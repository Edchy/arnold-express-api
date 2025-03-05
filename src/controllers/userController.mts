import { RequestHandler } from "express";
import { UserModel } from "../models/user.mjs";
import { DEFAULT_WORKOUT_IDS } from "../utils/constants.mjs";
import mongoose from "mongoose";

// Create a new user
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    // Convert string IDs to ObjectIds
    const defaultWorkoutIds = DEFAULT_WORKOUT_IDS.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const newUser = new UserModel({
      username,
      userWorkouts: defaultWorkoutIds,
    });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: (error as Error).message,
    });
  }
};
// get all
export const getMongoUsers: RequestHandler = async (req, res) => {
  try {
    const workouts = await UserModel.find({}).populate("userWorkouts");
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
// Get a user by ID
export const getUserById: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.x;
    const user = await UserModel.findById(userId).populate("userWorkouts");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error finding user",
      error: (error as Error).message,
      x: req.params.x,
    });
  }
};
