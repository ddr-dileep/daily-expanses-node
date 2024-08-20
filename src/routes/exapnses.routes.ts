import { Router } from "express";

import { verifyToken } from "../middlewares/auth.token.middleware";
import {
  createExpense,
  deleteExpanse,
  getAllExpanses,
  getExpanseById,
  updateExpanse,
} from "../controllers/expanses.controller";
import { createExpenseMiddleware } from "../middlewares/expanses.middlewares";

const expansesRouter = Router();

expansesRouter.get("/get-all", verifyToken, getAllExpanses);
expansesRouter.get("/get-one/:id", verifyToken, getExpanseById);
expansesRouter.post(
  "/create",
  verifyToken,
  createExpenseMiddleware,
  createExpense
);
expansesRouter.patch("/update/:id", verifyToken, updateExpanse);
expansesRouter.delete("/delete/:id", verifyToken, deleteExpanse);

export default expansesRouter;
