import express from "express";
import {
  createUser,
  getUserById,
  getMongoUsers,
} from "../controllers/userController.mjs";

const router = express.Router();
router.post("/", createUser);
router.get("/", getMongoUsers as express.RequestHandler);
router.get("/:id", getUserById as express.RequestHandler);

export default router;
