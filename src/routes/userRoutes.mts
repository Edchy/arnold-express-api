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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

const userRouter = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction for username sorting
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PublicUser'
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
userRouter.get("/", getMongoUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by UUID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUser'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.get("/:id", getMongoUserByUUID);

/**
 * @swagger
 * /users/{username}/workouts:
 *   get:
 *     summary: Get a user's workouts by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: User's username
 *     responses:
 *       200:
 *         description: List of user's workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkoutDto'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.get("/:username/workouts", getMongoUserWorkoutsByUsername);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (register)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Desired username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *             example:
 *               username: johndoe
 *               password: securePassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUser'
 *       400:
 *         description: Username already exists or invalid input
 *       500:
 *         description: Server error
 */
userRouter.post("/", createMongoUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     description: This endpoint is rate limited
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *             example:
 *               username: johndoe
 *               password: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/PublicUser'
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many login attempts
 *       500:
 *         description: Server error
 */
userRouter.post("/login", authLimiter, login);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes the authenticated user's account
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.delete("/", authenticateJWT, deleteMongoUser);

export default userRouter;
