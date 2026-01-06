import jsonwebtoken from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.models.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.cookies?.accessToken;
  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }
  const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ApiError(401, "Unauthorized"));
  }
  req.user = user;
  next();
});
export default authMiddleware;
