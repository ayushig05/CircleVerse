require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadToCloudinary = async (fileUri, resourceType = "image") => {
  try {
    const options = {
      folder: `circleverse/posts/${resourceType}`,
      resource_type: resourceType,
    };
    if (resourceType === "video") {
      options.transformation = [{ duration: 30 }];
    }
    const result = await cloudinary.uploader.upload(fileUri, options);
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(`Failed to upload ${resourceType} to Cloudinary`);
  }
};

module.exports = { uploadToCloudinary, cloudinary };
