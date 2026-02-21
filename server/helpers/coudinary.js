import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMediaToCloudinary = async (file, userId) => {
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          asset_folder: "upload_profile", // Optional: specify a folder for the image
          resource_type: "auto",
          public_id: `${userId}_${Date.now()}`, // Set the public_id for the image
        },
        (error, result) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      // Write the buffer to the stream
      uploadStream.end(file.buffer);
    });
    return uploadResult;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to upload the media");
  }
};

export const deleteMediaFromCloudinary = async (id) => {
  try {
    await cloudinary.uploader.destroy(id, {
      resource_type: "image",
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete the image");
  }
};
