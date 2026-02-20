import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import {
  getNotificationNumber,
  getUserPosts,
  getUserSavedPosts,
  updateUser,
} from "../controllers/user.js";

const router = express.Router();

router.put("/:id", verifyToken, updateUser);
router.get("/notifications", verifyToken, getNotificationNumber);
router.get("/user-posts", verifyToken, getUserPosts);
router.get("/user-savedPosts", verifyToken, getUserSavedPosts);

export default router;
