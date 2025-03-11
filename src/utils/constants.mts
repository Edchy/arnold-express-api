import dotenv from "dotenv";
dotenv.config();
// connection
export const PORT = process.env.PORT || 3000;

// default workout ids
export const DEFAULT_WORKOUT_IDS = [
  "67c6fdb71d048a3544ddeb25",
  "67d00e614fdfc23bd3b034bd",
  "67d01047d8ed9bc782d0bed5",
];
// rate limits
export const rateLimits = {
  auth: 5,
  global: 50,
  window: 15 * 60 * 1000,
};

// db
const dbuser = process.env.MONGOUSER;
const dbpassword = process.env.MONGOPASSWORD;
const db = process.env.MONGODATABASE;
const dbappname = process.env.MONGOAPPNAME;
export const MONGODB_URI = `mongodb+srv://${dbuser}:${
  dbpassword || ""
}@${dbappname}.k6akd.mongodb.net/${db}?retryWrites=true&w=majority&appname=${dbappname}`;
