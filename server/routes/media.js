import express from "express";
import multer from "multer";
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../helpers/coudinary.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    console.log(req.body, "request body");

    const result = await uploadMediaToCloudinary(req.file, req.userId);
    res.status(200).json({
      success: true,
      data: result,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload the media",
    });
  }
});
router.post(
  "/bulk-upload",
  verifyToken,
  upload.array("files", 10),
  async (req, res) => {
    try {
      console.log("files:", req.files);
      console.log("body:", req.body);
      const uploadFiles = req.files.map((file) =>
        uploadMediaToCloudinary(file, req.userId),
      );
      const result = await Promise.all(uploadFiles);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Failed to upload the media",
      });
    }
  },
);
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
