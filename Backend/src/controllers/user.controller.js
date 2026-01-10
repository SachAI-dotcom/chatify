import User from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { uploadOnClodinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import fs from 'fs';
const generateRefreshTokenAndAccessToken = asyncHandler(
  async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return next(new ApiError(401, "Cant find user while generating tokens"));
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Tokens generated successfully"
        )
      );
  }
);
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -accessToken"
  );
  return new ApiResponse(201, createdUser, "User registered successfully").send(
    res
  );
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, username } = req.body;
  if ((!email && !username) || !password) {
    return next(
      new ApiError(400, "Email or username and password are required")
    );
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    return next(new ApiError(401, "cant find user during login"));
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return next(new ApiError(401, "Incorrect Password"));
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -accessToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});
const logOut = asyncHandler(async (req, res) => {
  const user = req.user;
  const id = user._id;
  await User.findByIdAndUpdate(
    id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, logOut, generateRefreshTokenAndAccessToken };
