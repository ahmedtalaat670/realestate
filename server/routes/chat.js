import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import {
  addChat,
  getChat,
  getChatByUserId,
  getChats,
  readChat,
} from "../controllers/chat.js";

const router = express.Router();

router.get("/get-chats", verifyToken, getChats);
router.get("/get-chat/:chatId", verifyToken, getChat);
router.get("/get-chat-byId/:receiverId", verifyToken, getChatByUserId);
router.get("/add-chat/:receiverId", verifyToken, addChat);
router.put("/read-chat/:chatId", verifyToken, readChat);

export default router;
