import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import mediaRouter from "./routes/media.js";
import postRouter from "./routes/post.js";
import messageRouter from "./routes/message.js";
import chatRouter from "./routes/chat.js";
import cookieParser from "cookie-parser";
import cors from "cors";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const port = 8800;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/media", mediaRouter);
app.use("/post", postRouter);
app.use("/message", messageRouter);
app.use("/chat", chatRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("you are connected to mongodb"))
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log(`server is working on port ${port}`);
});
