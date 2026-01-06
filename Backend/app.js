import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from "./src/routes/user.routes.js";
import ApiError from "./src/utils/ApiError.js";

app.use("/api/v1/users", userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    } else if (err instanceof Error) {
        res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
            errors: [],
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

export default app;
