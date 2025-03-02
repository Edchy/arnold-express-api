import express from "express";
import startServer from "./utils/startServer.mjs";
import workoutRoutes from "./routes/workoutRoutes.mjs";
import { logger } from "./middleware/logger.mjs";
import connectToMongoDB from "./db/dbcon.mjs";
import { PORT } from "./models/types.mjs";

export const app = express();

app.use(logger);
app.use(express.json());
app.use("/workouts", workoutRoutes);

connectToMongoDB()
  .then(() => {
    startServer(PORT);
  })
  .catch(console.error);
// startServer(PORT);
