import express from "express";
import {
  register,
  verifyingCode,
  login,
  logout,
  isLoggedIn,
} from "../controllers/authentication.js";
import { verifyToken } from "../middleware/verify-token.js";
const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyingCode);
router.post("/login", login);
router.post("/logout", logout);
router.get("/authorization", verifyToken, isLoggedIn);

export default router;
