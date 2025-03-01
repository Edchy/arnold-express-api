import dotenv from "dotenv";
dotenv.config();

export type Port = string | number;

export const PORT: Port = process.env.PORT || 3000;

/**
 * Retrieves the MongoDB URI from the environment variables.
 *
 * @returns {string} The MongoDB URI.
 * @throws {Error} If the MONGODB_URI is not defined in the environment variables.
 */
export function getMongoURI(): string {
  const uri: string = process.env.MONGODB_URI || "";
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }
  return uri;
}
