import { Request, RequestHandler, Response } from "express";
import { getVersion } from "@/lib/appInfo.js";
import { HealthResponse } from "@/types/index.js";

export const GET: RequestHandler = (req: Request, res: Response) => {
  const healthResponse: HealthResponse = {
    status: "OK",
    timestamp: new Date().toISOString(),
    version: getVersion(),
    environment: process.env.NODE_ENV || "development",
  };

  res.status(200).json(healthResponse).send();
};
