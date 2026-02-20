import { Types } from "mongoose";
import Chat from "../models/chat.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await Chat.find({ usersId: tokenUserId })
      .populate("usersId", "name avatar")
      .populate({
        path: "lastMessageId",
        populate: { path: "userId", select: "name avatar" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  try {
    const chat = await Chat.findOne({
      _id: chatId,
      usersId: { $in: [tokenUserId] },
    })
      .populate({
        path: "messagesId",
        populate: { path: "userId", select: "name avatar" },
        options: {
          sort: { createdAt: -1 },
          ...(req.query.skip && { skip: req.query.skip }),
          limit: req.query.limit,
        },
      })
      .populate("usersId", "name avatar");
    chat.messagesId.reverse();
    if (!chat)
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const getChatByUserId = async (req, res) => {
  const receiverId = req.params.receiverId;
  const userId = req.userId;
  try {
    console.log(receiverId, "receiverId");
    console.log(userId, "userId");
    const chat = await Chat.findOne({
      usersId: {
        $all: [receiverId, userId],
      },
    }).populate("usersId", "name avatar");
    if (!chat)
      return res.status(404).json({
        success: false,
        message: "there is no chat between these users",
      });
    await chat.populate({
      path: "messagesId",
      populate: { path: "userId", select: "name avatar" },
      options: {
        sort: { createdAt: -1 },
        limit: 20,
      },
    });
    chat.messagesId.reverse();
    return res.status(200).json({ success: true, data: chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.params.receiverId;
  try {
    const existingChat = await Chat.findOne({
      usersId: { $all: [tokenUserId, receiverId] },
    });
    if (existingChat)
      return res.status(400).json({
        success: false,
        message: "there is already existing chat with the same users",
      });
    const newChat = await Chat.create({
      usersId: [tokenUserId, receiverId],
    });
    await newChat.populate("usersId", "name avatar");
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        usersId: tokenUserId,
      },
      {
        $addToSet: {
          seenBy: tokenUserId,
        },
      },
      { new: true }
    );
    if (!chat)
      return res.status(400).json({
        success: false,
        message:
          "there is no chat with this id or you are not participant in that chat",
      });
    res
      .status(200)
      .json({ success: true, message: "you have readen the chat" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
