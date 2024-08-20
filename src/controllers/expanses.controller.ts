import { Request, Response } from "express";
import { successResponse } from "../utils/apiResponse";
import Expanses from "../models/expanses.model";

export const getAllExpanses = async (req: Request | any, res: Response) => {
  try {
    const userId = req?.user?._id;
    const { filters } = req.body;

    let query: any = { userId };

    if (filters) {
      const { based, value } = filters;

      switch (based) {
        case "month":
          if (value) {
            const year = new Date().getFullYear(); // Use current year if not provided
            const month = getMonthNumber(value);

            if (month >= 1 && month <= 12) {
              const start = new Date(Date.UTC(year, month - 1, 1)); // Start of the month
              const end = new Date(Date.UTC(year, month, 1)); // Start of the next month
              query.date = { $gte: start, $lt: end };
            } else {
              return res.status(400).json({
                status: "bad_request",
                message: "Invalid month value",
              });
            }
          }
          break;
        case "year":
          if (value) {
            const start = new Date(Date.UTC(value, 0, 1)); // Start of the year
            const end = new Date(Date.UTC(value + 1, 0, 1)); // Start of the next year
            query.date = { $gte: start, $lt: end };
          }
          break;
        case "category":
          if (value) {
            query.category = value;
          }
          break;
        default:
          break;
      }
    }

    // Fetch filtered expanses
    const expanses = await Expanses.find(query);

    const msg =
      expanses.length > 0
        ? "Expanses fetched successfully"
        : "No expanses found";

    const response = {
      count: expanses.length,
      items: expanses,
    };

    res.status(200).json(successResponse(msg, response));
  } catch (error) {
    res.status(500).json({
      status: "server_error",
      message: "Error retrieving expanses",
      error,
    });
  }
};

// Helper function to convert month name to month number
function getMonthNumber(monthName: string): number {
  const months: any = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  return months[monthName] || 0; // Default to 0 if month name is invalid
}

export const getExpanseById = async (req: Request | any, res: Response) => {
  try {
    const userId = req?.user?._id;
    const expanseId = req.params.id;

    const expanse = await Expanses.findOne({ _id: expanseId, userId: userId });

    const response = {
      item: expanse,
    };

    if (expanse) {
      res
        .status(200)
        .json(successResponse("Expanse fetched successfully", response));
    } else {
      res.status(404).json({
        status: "not_found",
        message: "Expanse not found or does not belong to the user",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "server_error",
      message: "Error retrieving expanse",
      error,
    });
  }
};

export const createExpense = async (req: Request | any, res: Response) => {
  try {
    const { name, description, amount, category, date, notes } = req.body;
    const userId = req.user._id;

    // Create a new expanse document
    const newExpanse = new Expanses({
      name,
      description,
      amount,
      category,
      userId,
      date,
      notes,
    });

    // Save the expanse to the database
    const savedExpanse = await newExpanse.save();

    const resp = {
      item: savedExpanse,
    };

    res.status(201).json(successResponse("Expanse created successfully", resp));
  } catch (error) {
    res.status(500).json({
      status: "server_error",
      message: "Error creating expanse",
      error,
    });
  }
};

export const updateExpanse = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { name, description, amount, category, date, notes } = req.body;

    const expanse: any = await Expanses.findOne({ _id: id, userId });

    if (!expanse) {
      return res.status(404).json({
        status: "not_found",
        message: "Expanse not found or does not belong to the user.",
      });
    }

    // Update the expanse with new data if provided
    if (name) expanse.name = name;
    if (description) expanse.description = description;
    if (amount) expanse.amount = amount;
    if (category) expanse.category = category;
    if (date) expanse.date = date;
    if (notes) expanse.notes = notes;

    // Save the updated expanse to the database
    const updatedExpanse = await expanse.save();

    const resp = {
      item: updatedExpanse,
    };

    res.status(200).json(successResponse("Expense updated successfully", resp));
  } catch (error) {
    res.status(500).json({
      status: "server_error",
      message: "Error updating expense",
      error,
    });
  }
};

export const deleteExpanse = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const expanse = await Expanses.findOne({ _id: id, userId });

    if (!expanse) {
      return res.status(404).json({
        status: "not_found",
        message: "Expanse not found or does not belong to the user.",
      });
    }

    await Expanses.deleteOne({ _id: id, userId });

    res.status(200).json(successResponse("Expense deleted successfully", null));
  } catch (error) {
    res.status(500).json({
      status: "server_error",
      message: "Error deleting expense",
      error,
    });
  }
};
