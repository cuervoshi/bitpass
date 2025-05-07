import { Request, Response, NextFunction } from "express";
import { logger } from "../utils.js";

const log = logger.extend("app:routes");

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  log(`Request - ${req.method} ${req.path}`);
  next();
};
