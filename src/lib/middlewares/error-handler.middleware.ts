import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../../types/index.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errorResponse: ErrorResponse = {
    status: "error",
    message: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  };

  console.error(`Error: ${err.message}`);
  res.status(500).json(errorResponse);
};
