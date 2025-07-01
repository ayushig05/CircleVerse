require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadToCloudinary = async (fileUri) => {
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "circleverse/posts",
    });
    return result;
  } catch (error) {
    throw new Error("Failed to upload image to Cloudinary");
  }
};

module.exports = { uploadToCloudinary, cloudinary };
