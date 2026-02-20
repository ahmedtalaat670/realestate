import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import { sendMessage } from "../controllers/message.js";

const router = express.Router();

router.post("/send-message/:chatId", verifyToken, sendMessage);

export default router;
