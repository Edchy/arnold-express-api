import { Router } from "express";
import {
  createMongoUser,
  getMongoUserById,
  getMongoUsers,
  login,
} from "../controllers/userController.mjs";
import { authLimiter } from "../middleware/rateLimiters.mjs";
import { authenticateJWT } from "../middleware/jwt.mjs";

const userRouter = Router();
userRouter.get("/", authenticateJWT, getMongoUsers);
userRouter.get("/:id", authenticateJWT, getMongoUserById);
userRouter.post("/", createMongoUser);
userRouter.post("/login", authLimiter, login);

export default userRouter;
