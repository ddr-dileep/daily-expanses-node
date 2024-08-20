import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { validationErrorResponse } from "../utils/apiResponse";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(
        validationErrorResponse("Access denied. No token provided.", false)
      );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Find the user by ID
    const user = await User.findById(decoded.id).select("-password"); // Exclude password from the user object
    if (!user) {
      return res
        ?.status(401)
        ?.json(validationErrorResponse("Invalid token.", false));
    }

    // Attach the user to the request object
    req.user = user;

    return next();
  } catch (error) {
    res.status(400).json(validationErrorResponse("Invalid token.", false));
  }
};
