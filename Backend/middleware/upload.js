import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js"; // loads credentials from cloudinary.js

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a single file buffer to Cloudinary
export const uploadToCloudinary = async (fileBuffer, folder = "fundraiser_proofs") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export { upload };
