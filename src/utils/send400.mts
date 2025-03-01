import { Response } from "express";

export const send400 = (res: Response, message: Object) => {
  res.status(404).json(message);
};
