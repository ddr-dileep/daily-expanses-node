import { Router } from "express";
import {
  createUser,
  getUserProfile,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/user.controller";
import { createUserMiddleWare, loginUserMiddleWare } from "../middlewares/create.user.middleware"; // prettier-ignore
import { verifyToken } from "../middlewares/auth.token.middleware";
import { uploadProfileImage } from "../utils/multerUploadFile";

const userRouter = Router();

userRouter.post("/create", createUserMiddleWare, createUser);
userRouter.post("/login", loginUserMiddleWare, loginUser);
userRouter.get("/profile", verifyToken, getUserProfile);
userRouter.get("/get-all", verifyToken, getUsers);
userRouter.patch("/update", verifyToken, uploadProfileImage, updateUser);

export default userRouter;
