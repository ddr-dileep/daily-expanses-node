import { v2 as cloudinary } from "cloudinary";
import { deleteFile } from "./deleteFile";

const cloudinaryFileUpload = async (url: any) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const result = await cloudinary.uploader.upload(url, {
      folder: "daily-expanses",
      resource_type: "auto",
    });

    await deleteFile(url); // delete the file after successful upload
    return result?.url;
  } catch (error: any) {
    await deleteFile(url); // delete the file if failed to upload
    console.error("Error uploading file:", error.message);
  }
};

export default cloudinaryFileUpload;
