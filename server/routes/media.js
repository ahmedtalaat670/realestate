import express from "express";
import multer from "multer";
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../helpers/coudinary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload the media",
    });
  }
});
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromise = req.files.map((file) =>
      uploadMediaToCloudinary(file.path)
    );
    const result = await Promise.all(uploadPromise);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload the media",
    });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await deleteMediaFromCloudinary(id);
    res
      .status(200)
      .json({ success: true, message: "the media is deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to delete the media" });
  }
});

export default router;
