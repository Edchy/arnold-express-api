import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { send400 } from "../utils/send400.mjs";
// import { getDb } from "../db/dbcon.mjs";
import { WorkoutModel } from "../models/workout.mjs";
import testworkouts from "../testdata.js";

//GET
export function getTestWorkouts(req: Request, res: Response): void {
  try {
    res.status(200).json(testworkouts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching workouts",
      error: (error as Error).message,
    });
  }
}
export async function getMongoWorkouts(req: Request, res: Response) {
  try {
    const workouts = await WorkoutModel.find({});
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

//POST
// export function createWorkout(req: Request, res: Response): void {
//   try {
//     const { name, exercises } = req.body;
//     if (!name || typeof name !== "string") {
//       send400(res, { message: "Name is required" });
//       return;
//     }

//     if (!Array.isArray(exercises)) {
//       send400(res, { message: "Exercises must be an array" });
//       return;
//     }
//     const validExercises = exercises.every(
//       (exercise) =>
//         exercise.name &&
//         typeof exercise.name === "string" &&
//         typeof exercise.reps === "number" &&
//         typeof exercise.sets === "number"
//     );

//     if (!validExercises) {
//       send400(res, {
//         message:
//           "Each exercise must have a name(string), reps(number), and sets(number)",
//       });
//       return;
//     }
//     const newWorkout: Workout = {
//       id: uuidv4(),
//       name: req.body.name,
//       exercises: req.body.exercises || [],
//     };

//     workouts.push(newWorkout);
//     res.status(201).json(newWorkout);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating workout",
//       error: (error as Error).message,
//     });
//   }
// }

// export const WORKOUTS = {
//   get: getAllWorkouts,
//   post: createWorkout,
// };

// app.get("/api", (req, res) => {
//   const searchQuery = req.query.q?.toString().toLowerCase() || "";

//   if (!searchQuery) {
//     res.json(workouts);
//     return;
//   }
//   const result = workouts.filter((workout) => {
//     return (
//       workout.exercises.filter((exercise) => {
//         return exercise.name.toLowerCase().includes(searchQuery);
//       }).length > 0
//     );
//   });
//   res.json(result);
// });
