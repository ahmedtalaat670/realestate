import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to upload the media");
  }
};

export const deleteMediaFromCloudinary = async (id) => {
  try {
    await cloudinary.v2.uploader.destroy(id, {
      resource_type: "image",
    });
  } catch (e) {
    console.log(e);
    throw new Error("Failed to delete the media");
  }
};
