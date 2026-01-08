import jwt from "jsonwebtoken";
import User from "../models/user.models.js"; 
import ApiError from "../utils/ApiError.js";

const socketAuthMiddleware = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    const token = cookieHeader
      ?.split(";")
      .map((c) => c.trim())
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      throw new ApiError(401, "unauthorized access");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }
      
    const user = await User.findById(decoded._id).select("-password"); // ensure payload field matches

    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    console.log(
      `Socket authenticated for user: ${user.fullName} (${user._id})`
    );

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};

export default socketAuthMiddleware;
