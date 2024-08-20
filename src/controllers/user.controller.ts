import { Request, Response } from "express";
import User from "../models/user.model";
import {
  serverErrorResponse,
  successResponse,
  validationErrorResponse,
} from "../utils/apiResponse";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinaryFileUpload from "../utils/coudinaryUpload";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json(successResponse("User created successfully", user));
  } catch (error: any) {
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateKey];
      const errorMessage = `Duplicate value for key: ${duplicateKey} ${duplicateValue}`;

      res.status(400).json(validationErrorResponse(errorMessage, true));
    } else {
      res.status(500).json(serverErrorResponse("Error creating user", error));
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(validationErrorResponse("Invalid email or password", false));
    }

    // if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(validationErrorResponse("Invalid email or password", false));
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "10h" }
    );

    res.status(200).json(successResponse("Login successful", { token }));
  } catch (error) {
    res.status(500).json(serverErrorResponse("Error logging in", error));
  }
};

export const getUserProfile = async (req: Request | any, res: Response) => {
  try {
    const user = req.user;

    res
      .status(200)
      .json(successResponse("User profile retrieved successfully", user));
  } catch (error) {
    res.status(500).json({
      status: "server_error",
      message: "Error retrieving user profile",
      error,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json(successResponse("Users retrieved successfully", users));
  } catch (error) {
    res.status(500).json(serverErrorResponse("Error retrieving users", error));
  }
};

export const updateUser = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, email, password, mobile, address, role, isActive } = req.body;
    const profileImage = req.file; // get file from request

    // find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json(validationErrorResponse("User not found", false));
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.mobile = mobile || user.mobile;
    user.address = address || user.address;
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    if (profileImage) {
      const image = await cloudinaryFileUpload(profileImage.path);
      user.profileImage = image || ""; // Save local file path
    }

    // Save updated user
    const updatedUser = await user.save();

    res
      .status(200)
      .json(successResponse("User updated successfully", updatedUser));
  } catch (error) {
    res.status(500).json(serverErrorResponse("Error updating user", error));
  }
};
