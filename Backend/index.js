import dotenv from "dotenv";
import connectDatabase from "./src/db/index.js";
import app from "./app.js";
import { DB_NAME } from "./constants.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
