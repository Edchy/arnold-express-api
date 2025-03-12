import { Router } from "express";
import {
  createMongoUser,
  getMongoUserByUUID,
  getMongoUserWorkoutsByUsername,
  getMongoUsers,
  login,
  deleteMongoUser,
} from "../controllers/userController.mjs";
import { authLimiter } from "../middleware/rateLimiters.mjs";
import { authenticateJWT } from "../middleware/jwt.mjs";

const userRouter = Router();
userRouter.get("/", getMongoUsers);
userRouter.get("/:id", getMongoUserByUUID);
userRouter.get("/:username/workouts", getMongoUserWorkoutsByUsername);
userRouter.post("/", createMongoUser);
userRouter.post("/login", authLimiter, login);
userRouter.delete("/", authenticateJWT, deleteMongoUser);

export default userRouter;
