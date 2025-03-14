import { RequestHandler } from "express";
import { UserModel } from "../models/user.mjs";
import { DEFAULT_WORKOUT_IDS } from "../utils/constants.mjs";
import mongoose from "mongoose";
import { sendBadRequest } from "../utils/helpers.mjs";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.mjs";
import { transformToWorkoutDto } from "../models/workout.mjs";
import { Workout } from "../models/workout.mjs";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../utils/constants.mjs";

// Create a new user
export const createMongoUser: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      !username ||
      username.length < USERNAME_MIN_LENGTH ||
      username.length > USERNAME_MAX_LENGTH
    ) {
      sendBadRequest(
        res,
        `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters long`
      );
      return;
    }

    if (!password || password.length < PASSWORD_MIN_LENGTH) {
      sendBadRequest(
        res,
        `Password must be atleast ${PASSWORD_MIN_LENGTH} characters long`
      );
      return;
    }

    if (await UserModel.findOne({ username })) {
      sendBadRequest(res, {
        message: "That username is so good, it's already taken!",
      });
      return;
    }
    // Hash the password
    const saltRounds = 1; // higher number = more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // all new users will have the default workouts
    // Convert string IDs to mongoose ObjectIds
    const defaultWorkoutIds = DEFAULT_WORKOUT_IDS.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Create a new user and save it to the database
    const newUser = await UserModel.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      userWorkouts: defaultWorkoutIds,
    });

    // Send the new user as a response but only the public fields
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
  console.log(req.query);
  try {
    const users = await UserModel.find({});
    if (!users) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    if (req.query.sort) {
      let sortedUsers;
      if (req.query.sort === "asc") {
        sortedUsers = users
          .sort((a, b) => b.username.localeCompare(a.username))
          .map((user) => user.username);
      } else {
        sortedUsers = users
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user) => user.username);
      }
      res.status(200).json(sortedUsers);
      return;
    }

    // Send only the public fields of the users
    const publicUsers = users.map((user) => user.toPublicJSON());
    res.status(200).json(publicUsers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
// Get a user by ID
export const getMongoUserByUUID: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findOne({ id: userId }); // pass the id as a query (not _id)

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error finding user",
      error: (error as Error).message,
      id: req.params.id,
    });
  }
};

// get userworkouts by querying the username (works because username is unique)
export const getMongoUserWorkoutsByUsername: RequestHandler = async (
  req,
  res
) => {
  try {
    const username = req.params.username;
    const user = await UserModel.findOne({ username }).populate("userWorkouts");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const workoutsDto = transformToWorkoutDto(user.userWorkouts as Workout[]);
    res.status(200).json(workoutsDto);
    return;
  } catch (error) {
    res.status(500).json({
      message: "Error fetching workouts",
      error: (error as Error).message,
    });
  }
};
// Login user
export const login: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      sendBadRequest(res, "Username and password are required");
      return;
    }

    const user = await UserModel.findOne({ username });

    const errorResponse = { message: "Wrong username and/or password" };
    if (!user) {
      res.status(401).json(errorResponse);
      return;
    }
    // Compare the password the user is posting with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json(errorResponse);
      return;
    }
    // Generate JWT
    const token = generateToken(user.id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during login",
      error: (error as Error).message,
    });
  }
};

// Delete a user by ID
export const deleteMongoUser: RequestHandler = async (req, res) => {
  try {
    console.log("User from token:", req.user);
    const userId = req.user.userId;

    // Find user by custom UUID field first
    const user = await UserModel.findOne({ id: userId });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("Found user:", user._id);

    // Delete user by MongoDB _id
    await UserModel.findByIdAndDelete(user._id);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      message: "Failed to delete account",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYTNkYzA2Ni1lZWQwLTRmNmYtYjdhOS1jZjlkMzBhNzJkMTMiLCJpYXQiOjE3NDE3NzI4MzksImV4cCI6MTc0MTg1OTIzOX0.727N3TwGFGJfG-Eza8vThaujVxlUPl9CfM2FSIVzvW4
