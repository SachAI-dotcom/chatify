import express from "express";
import { registerUser, loginUser, logOut, generateRefreshTokenAndAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(
    
    registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(authMiddleware, logOut);
router.route("/refresh-token").post(authMiddleware, generateRefreshTokenAndAccessToken);

export default router;
