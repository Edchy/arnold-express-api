import e, { RequestHandler } from "express";
import { sendBadRequest } from "../utils/helpers.mjs";
import { transformToWorkoutDto, WorkoutModel } from "../models/workout.mjs";
import mongoose from "mongoose";
import { UserModel } from "../models/user.mjs";
import { Exercise, Workout } from "../models/workout.mjs";

export const getMongoWorkouts: RequestHandler = async (req, res) => {
  const search = req.query.s as string;
  const userName = req.query.u as string;

  try {
    console.log(
      mongoose.connection.db
        ? `Connected to: ${mongoose.connection.db.databaseName}`
        : "Not connected to a db"
    );

    const workouts = await WorkoutModel.find({});
    console.log(Boolean(req.query.s), req.query.s);

    // query for usercreated workouts
    if (userName) {
      const userWorkouts = await WorkoutModel.find({ createdBy: userName });
      res.status(200).json(
        userWorkouts.map((workout) => ({
          id: workout._id,
          name: workout.name,
          exercises: workout.exercises,
        }))
      );
      return;
    }

    // query for exercises return all workouts that contain a specific exercise
    if (search) {
      const filteredWorkouts = workouts.filter((workout) =>
        workout.exercises.some((exercise) => {
          const exerciseName = exercise.name.toLowerCase().replace(/\s+/g, "");
          const searchName = search.toLowerCase().replace(/\s+/g, "");
          return exerciseName.includes(searchName);
        })
      );
      res.status(200).json(transformToWorkoutDto(filteredWorkouts));
      return;
    }
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
  console.log("Request user:", req.user);

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, exercises } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!name || !Array.isArray(exercises)) {
      sendBadRequest(res, { message: "Name and exercises array are required" });
      return;
    }

    const user = await UserModel.findOne({ id: userId }).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newWorkout = await WorkoutModel.create(
      [
        {
          name,
          exercises,
          createdBy: user.username,
        },
      ],
      { session }
    );
    console.log("New workout:", newWorkout);

    // MongoDB creates an array when using create with session
    // Update the user's userWorkouts array with the new workout's ID

    await UserModel.updateOne(
      { id: userId },
      { $push: { userWorkouts: newWorkout[0]._id } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    res.status(201).json(newWorkout);

    if (mongoose.connection.db) {
      console.log(`Saving to database: ${mongoose.connection.db.databaseName}`);
      console.log(`Saving to collection: ${WorkoutModel.collection.name}`);
    }
  } catch (error) {
    // Abort the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();

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

// delete workout. If it's a default workout, only remove the reference from the user
export const deleteMongoWorkout: RequestHandler = async (req, res) => {
  console.log("Request user:", req.user);
  const workoutId = req.params.id;
  const userId = req.user.userId; // From JWT
  const workoutObjectId = new mongoose.Types.ObjectId(workoutId); // might not be needed

  console.log("User ID:", userId);
  console.log("Workout ID:", workoutId);

  // Start a session for the transaction to ensure data consistency
  // KOMMENTAR: vi har en session som vi kan använda för att göra flera operationer i databasen och sedan commita eller aborta baserat på om allt gick bra eller inte. Det jag vill är att om en operation failar så ska vi inte göra något alls. Om allt går bra så ska vi commita och spara ändringarna.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the workout using ObjectId
    const workout = await WorkoutModel.findById(workoutId).session(session);

    if (!workout) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "Workout not found" });
      return;
    }

    // Check if this is a default workout
    const isDefaultWorkout = workout.isDefault === true;
    console.log(`Is default workout: ${isDefaultWorkout}`);

    // Find the user by their custom ID and remove the workout reference
    // Using workoutObjectId instead of workoutId string (not sure if needed)
    const userUpdateResult = await UserModel.findOneAndUpdate(
      { id: userId },
      {
        $pull: { userWorkouts: workoutObjectId },
      },
      { session, new: true }
    );

    if (!userUpdateResult) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Only delete the workout document if it's not a default workout
    if (!isDefaultWorkout) {
      const deleteResult = await WorkoutModel.findByIdAndDelete(
        workoutObjectId
      ).session(session);

      if (!deleteResult) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Failed to delete workout" });
        return;
      }
    }

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (error) {
    // Abort the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();

    console.error("Error deleting workout:", error);

    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "Invalid workout ID format",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete workout",
      error: (error as Error).message,
    });
  }
};

// PUT
export const updateMongoWorkout: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const workoutData = req.body;
    const userId = req.user.userId; // From JWT authentication middleware
    console.log(req.params);

    const existingWorkout = await WorkoutModel.findById(id);
    if (!existingWorkout) {
      res.status(404).json({ message: "Workout not found" });
      return;
    }
    console.log(existingWorkout.isDefault);

    // dont update default workouts (they are shared)
    // todo: instead create a new workout and update that - add that to the user's workouts - remoe the old one..
    if (existingWorkout.isDefault) {
      res.status(403).json({
        message: "Cannot update a default workout",
      });
      return;
    }

    const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
      id,
      {
        name: (workoutData as Workout).name,
        exercises: (workoutData as Workout).exercises.map(
          (exercise: Exercise) => ({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
          })
        ),
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error("Error updating workout:", error);

    // Handle MongoDB validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Invalid workout data",
        errors: Object.values(error.errors).map((err) => err.message),
      });
      return;
    }

    res.status(500).json({ message: "Failed to update workout" });
  }
};
