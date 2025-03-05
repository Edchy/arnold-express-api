import { RequestHandler } from "express";
import { UserModel } from "../models/user.mjs";
import { DEFAULT_WORKOUT_IDS } from "../utils/constants.mjs";
import mongoose from "mongoose";

// Create a new user
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
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
      password,
      userWorkouts: defaultWorkoutIds,
    });
    await newUser.save();

    res.status(201).json(newUser.toPublicJSON());
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

// Add login functionality
export const login: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Simple password check (plain text for now)
    if (user.password !== password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Return user without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      userWorkouts: user.userWorkouts,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      message: "Login successful",
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during login",
      error: (error as Error).message,
    });
  }
};
