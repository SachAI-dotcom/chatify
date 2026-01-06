import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../.env";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.API_SECRET,
});

const uploadOnClodinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    await fs.promises.unlink(localFilePath);

    return response;
  } catch (error) {
    await fs.promises.unlink(localFilePath).catch(() => {});
    return null;
  }
};
