import { Router } from "express";
import {
  createMongoUser,
  getUserById,
  getMongoUsers,
  login,
} from "../controllers/userController.mjs";

//
export const USERS_ROUTE = "/users";
const userRouter = Router();
userRouter.post("/", createMongoUser);
userRouter.get("/", getMongoUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/login", login);

export default userRouter;
