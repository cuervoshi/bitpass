import { NextFunction, Request, Response } from "express";

export interface ExtendedRequest extends Request {
  userId: string;
}

export type RestHandler = {
  (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
};
