import { RequestHandler } from "express";
import { UserModel } from "../models/user.mjs";
import { DEFAULT_WORKOUT_IDS } from "../utils/constants.mjs";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { sendBadRequest } from "../utils/helpers.mjs";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.mjs";

// Create a new user
export const createMongoUser: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      sendBadRequest(res, "Username is required");
      return;
    }

    if (password.length < 6) {
      sendBadRequest(res, "Password must be at least 6 characters long");
      return;
    }

    if (await UserModel.findOne({ username })) {
      sendBadRequest(res, "Username already taken");
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
      username,
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
  try {
    const users = await UserModel.find({}).populate("userWorkouts");
    const publicUsers = users.map((user) => user.toPublicJSON());
    res.status(200).json(publicUsers);
    // res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
// Get a user by ID
export const getMongoUserByUUID: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    // const user = await UserModel.findById(userId).populate("userWorkouts");
    const user = await UserModel.findOne({ id: userId });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user.toPublicJSON());
  } catch (error) {
    res.status(500).json({
      message: "Error finding user",
      error: (error as Error).message,
      id: req.params.id,
    });
  }
};

// get user workouts by querying the user's id (not _id)
// export const getMongoUserWorkoutsByUUID: RequestHandler = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const user = await UserModel.findOne({ id }).populate("userWorkouts");

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json(user.userWorkouts);
//     return;
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching workouts",
//       error: (error as Error).message,
//     });
//   }
// };
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

    res.status(200).json(user.userWorkouts);
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
      // res.status(400).json({ message: "Username and password are required" });
      return;
    }

    const user = await UserModel.findOne({ username });

    const errorResponse = { message: "Wrong username and/or password" };
    if (!user) {
      res.status(401).json(errorResponse);
      return;
    }

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
