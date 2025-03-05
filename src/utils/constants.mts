import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;

export const DEFAULT_WORKOUT_IDS = [
  "67c6fdb71d048a3544ddeb25",
  "67c6fde01d048a3544ddeb28",
];

// MOngo
const dbuser = process.env.MONGOUSER;
const dbpassword = process.env.MONGOPASSWORD;
const db = process.env.MONGODATABASE;
const dbappname = process.env.MONGOAPPNAME;
export const MONGODB_URI = `mongodb+srv://${dbuser}:${
  dbpassword || ""
}@${dbappname}.k6akd.mongodb.net/${db}?retryWrites=true&w=majority&appname=${dbappname}`;
