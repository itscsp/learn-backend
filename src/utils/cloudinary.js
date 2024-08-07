import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";
import { fileURLToPath } from "url";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (localFilePath) return null;

    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(fileURLToPath, {
      resource_type: "auto",
    });

    //file has been uploaded successfull
    console.log("File is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };