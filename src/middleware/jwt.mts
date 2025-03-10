import { RequestHandler, Request } from "express";
import { verifyToken } from "../utils/auth.mjs";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const authenticateJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers.authorization);
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
