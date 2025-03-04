import dotenv from "dotenv";
import { Response } from "express";
import { MONGODB_URI } from "./constants.mjs";

dotenv.config();

/**
 * Sends a 400 Bad Request response with the provided message.
 *
 * @param res - The response object to send the status and message.
 * @param message - The message to be sent in the response body.
 */
export const send400 = (res: Response, message: Object) => {
  res.status(400).json(message);
};

/**
 * Retrieves the MongoDB URI from the environment variables.
 *
 * @returns {string} The MongoDB URI.
 * @throws {Error} If the MONGODB_URI is not defined in the environment variables.
 */
export function getMongoURI(): string {
  const uri: string = MONGODB_URI || "";
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }
  return uri;
}
