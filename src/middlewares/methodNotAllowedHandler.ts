import { Request, Response, NextFunction } from "express";
import { methodNotAllowedResponse } from "../utils/apiResponse";

export const methodNotAllowedHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const message = `Method ${req.method} is not allowed for the requested path ${req.originalUrl}.`;
  console.error(
    `[ERROR] Method ${req.method} is not allowed on ${req.originalUrl}`
  );
  res.status(405).json(methodNotAllowedResponse(message));
};
