import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  savePost,
} from "../controllers/post.js";

const router = express.Router();

router.get("/get-posts", getPosts);
router.get("/get-post/:id", getPost);
router.post("/add-post", addPost);
router.delete("/delete/:id", verifyToken, deletePost);
router.put("/save-post/:id", savePost);

export default router;
