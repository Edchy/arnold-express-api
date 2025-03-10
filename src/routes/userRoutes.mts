import { Router } from "express";
import {
  createMongoUser,
  getMongoUserByUUID,
  // getMongoUserWorkoutsByUUID,
  getMongoUserWorkoutsByUsername,
  getMongoUsers,
  login,
} from "../controllers/userController.mjs";
import { authLimiter } from "../middleware/rateLimiters.mjs";
import { authenticateJWT } from "../middleware/jwt.mjs";

const userRouter = Router();
userRouter.get("/", getMongoUsers);
userRouter.get("/:id", getMongoUserByUUID);
// userRouter.get("/:id/workouts", getMongoUserWorkoutsByUUID);
userRouter.get("/:username/workouts", getMongoUserWorkoutsByUsername);
userRouter.post("/", createMongoUser);
userRouter.post("/login", authLimiter, login);

export default userRouter;
