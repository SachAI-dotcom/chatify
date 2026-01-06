import User from "../models/user.models";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const generateRefreshTokenAndAccessToken = async (req, res) => {
  const user = req.user;
  if (!user) {
    return new ApiError(401, "Cant find user while generating tokens");
  }
  const refreshToken = jsonwebtoken.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  const accessToken = jsonwebtoken.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  return new ApiResponse(
    200,
    { refreshToken, accessToken },
    "Tokens generated successfully"
  ).send(res);
};
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }
  const user = await User.create({ username, email, password });
  return new ApiResponse(201, user, "User registered successfully").send(res);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(401, "cant find user during login"));
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new ApiError(401, "Incorrect Password"));
  }
});
const logOut = asyncHandler(async (req, res) => {
  const user = req.user;
  const id = user._id;
  await User.findByIdAndUpdate(id,{
    $unset:{
        refreshToken:1,
    }
  },
  {
    new:true,
  }
);
const options = {
    httpOnly:true,
    secure:true,
}
return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"));

});
