import express from "express";
import startServer from "./utils/startServer.mjs";
import workoutRoutes from "./routes/workoutRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import { logger } from "./middleware/logger.mjs";
import connectToMongoDB from "./db/dbcon.mjs";
import { PORT } from "./utils/constants.mjs";

import { swaggerUi, specs } from "./utils/swagger.mjs";

export const app = express();

app.use(logger);
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

connectToMongoDB()
  .then(() => {
    startServer(PORT);
  })
  .catch(console.error);
// startServer(PORT);
