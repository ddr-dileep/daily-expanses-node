import { NextFunction, Request, Response } from "express";
import { validationErrorResponse } from "../utils/apiResponse";

export const createExpenseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, amount, category, date } = req.body;
  if (!name || !amount || !category || !date) {
    return res.status(400).json(
      validationErrorResponse("Validation Error", {
        name: name ? undefined : "Name is required",
        amount: amount ? undefined : "Amount is required",
        category: category ? undefined : "Category is required",
        date: date ? undefined : "Date is required",
      })
    );
  }
  return next();
};
