import { Router } from "express";

import userRouter from "./user.routes";
import expansesRouter from "./exapnses.routes";

const allRouter = Router();

allRouter.use("/user", userRouter); // user routes
allRouter.use("/expanses", expansesRouter); // exapnses routes

export default allRouter;
