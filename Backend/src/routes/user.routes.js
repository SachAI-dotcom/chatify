import express from "express";
import {
  loginUser,
  registerUser,
  logOut,
  generateRefreshTokenAndAccessToken,
  updateProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import arcjetProtection from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logOut);

router.put("/update-profile", authMiddleware, updateProfile);

router.get("/check", authMiddleware, (req, res) =>
  res.status(200).json(req.user)
);

export default router;
