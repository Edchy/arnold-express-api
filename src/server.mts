import express, { json } from "express";
import startServer from "./utils/startServer.mjs";
import workoutRoutes from "./routes/workoutRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import { logger } from "./middleware/logger.mjs";
import connectToMongoDB from "./dbcon.mjs";
import { PORT, frontendUrl } from "./utils/constants.mjs";
import cors from "cors";
import { swaggerUi, specs } from "./utils/swagger.mjs";
import limiter from "./middleware/rateLimiters.mjs";
import morgan from "morgan";

export const app = express();

//Middlewares
// app.use(morgan("tiny"));
app.use(limiter);
// app.use(
//   cors({
//     origin: frontendUrl,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204,
//   })
// );
app.use(cors());

// app.use(logger);
app.use(json());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);
app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);
app.get("/", (_, res) => {
  res.send(`
    <ul>
      <li><a href="/api-docs">API Documentation</a></li>
      <li><a href="https://arnold-n9wx.onrender.com/">Live Backend</a></li>
      <li><a href="https://rnld-astro-react.onrender.com/">Live Frontend</a></li>
    </ul>
    <p>Hostade på Render's Free Tier så dom "somnar" efter inaktivitet, men bör spinna upp efter nån minut man vill testa</p>
  `);
});

connectToMongoDB()
  .then(() => {
    startServer(PORT);
  })
  .catch(console.error);
// startServer(PORT);
