import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TOKEN_EXPIRATION_TIME } from "./constants.mjs";

dotenv.config();

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error(
    "JWT_SECRET is not defined. Please set it in your .env file."
  );
}
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: TOKEN_EXPIRATION_TIME });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error("Token verification failed:", (error as Error).message);

    return null;
  }
};
