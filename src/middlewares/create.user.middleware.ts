import { NextFunction, Request, Response } from "express";
import { validationErrorResponse } from "../utils/apiResponse";

export const createUserMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json(
      validationErrorResponse("Validation Error", {
        name: name ? undefined : "Name is required",
        email: email ? undefined : "Email is required",
        password: password ? undefined : "Password is required",
      })
    );
  }
  return next();
};

export const loginUserMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(
      validationErrorResponse("Validation Error", {
        email: email ? undefined : "Email is required",
        password: password ? undefined : "Password is required",
      })
    );
  }
  return next();
};
