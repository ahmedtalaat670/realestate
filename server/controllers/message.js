import Message from "../models/message.js";
import Chat from "../models/chat.js";

export const sendMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await Chat.findById(chatId);
    console.log(req.body);

    if (!chat)
      return res
        .status(404)
        .json({ success: false, message: "Chat not found!" });

    const message = await Message.create({
      chatId,
      text,
      userId: tokenUserId,
    });

    await Chat.findByIdAndUpdate(chatId, {
      $set: {
        lastMessageId: message._id,
        seenBy: [tokenUserId],
      },
      $push: {
        messagesId: message._id,
      },
    });
    await message.populate("userId", "name avatar");
    res.status(201).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
