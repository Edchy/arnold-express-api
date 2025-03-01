import { Request, Response, NextFunction } from "express";

let requestCounter = 0;

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const currentDate = new Date().toISOString();
  console.log(`[${currentDate}] ${req.method} ${req.url}`);
  console.log(req.httpVersion);
  console.log(req.params);
  console.log(req.query);
  console.log(req.next);
  requestCounter++;
  console.log(`Request number: ${requestCounter}`);
  next();
};
