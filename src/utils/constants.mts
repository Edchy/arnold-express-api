import dotenv from "dotenv";
dotenv.config();
// connection
export const PORT = process.env.PORT || 3000;

// default workout ids
export const DEFAULT_WORKOUT_IDS = [
  "67d02c2ea53d4bff776e092d",
  "67d02c55a53d4bff776e092f",
];
// rate limits
export const rateLimits = {
  auth: 5,
  global: 50,
  window: 15 * 60 * 1000,
};

// jwt
export const TOKEN_EXPIRATION_TIME = "1d";

// db
const dbuser = process.env.MONGOUSER;
const dbpassword = process.env.MONGOPASSWORD;
const db = process.env.MONGODATABASE;
const dbappname = process.env.MONGOAPPNAME;
export const MONGODB_URI = `mongodb+srv://${dbuser}:${
  dbpassword || ""
}@${dbappname}.k6akd.mongodb.net/${db}?retryWrites=true&w=majority&appname=${dbappname}`;
