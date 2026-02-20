import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { randomOtpGenerator, sendEmail } from "../helpers/nodemailer.js";
import { deleteMediaFromCloudinary } from "../helpers/coudinary.js";
import jwt from "jsonwebtoken";
import Post from "../models/post.js";
import { Types } from "mongoose";
import Chat from "../models/chat.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, name, email, avatar_id } = req.body;
  console.log(req.body);

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    const user = await User.findById(id);

    if (name) {
      if (user.name !== name) {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "there is user with the same name" });
        }
        user.name = name;
      }
    }
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    if (email) {
      if (user.email !== email) {
        user.email = email;
        const otp = randomOtpGenerator();
        user.otp = otp;
        user.isVerified = false;
        user.otpExpiryDate = Date.now() + 1000 * 60 * 60 * 2;
        sendEmail(email, otp);
      }
    }
    if (user.avatar !== avatar) {
      if (avatar === "") {
        await deleteMediaFromCloudinary(user.avatar_id);
        user.avatar = null;
        user.avatar_id = null;
      } else {
        user.avatar = avatar;
        user.avatar_id = avatar_id;
      }
    }
    await user.save();
    res.status(200).json({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      verified: user.isVerified,
      userId: user._id,
      savedPosts: user.savedPosts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const getUserPosts = async (req, res) => {
  const userId = req.userId;
  const pageNum = parseInt(req.query.page) || 1;
  const limit = 4;
  try {
    const userPostsLength = await Post.countDocuments({ userId });
    const userPosts = await Post.find({ userId })
      .limit(limit)
      .skip((pageNum - 1) * limit);

    return res.status(200).json({
      posts: userPosts,
      totalPages: Math.ceil(userPostsLength / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong " });
  }
};
export const getUserSavedPosts = async (req, res) => {
  const userId = req.userId;
  const pageNum = parseInt(req.query.page) || 1;
  const limit = 4;
  try {
    const user = await User.findOne({ _id: userId }).populate({
      path: "savedPosts",
    });
    const userSavedPostsLength = user.savedPosts.length;
    const userSavedPostsData = user.savedPosts.slice(
      pageNum * limit - limit,
      pageNum * limit
    );

    console.log(userSavedPostsData);
    return res.status(200).json({
      posts: userSavedPostsData,
      totalPages: Math.ceil(userSavedPostsLength / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong " });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userId = new Types.ObjectId(tokenUserId);
    const number = await Chat.countDocuments({
      usersId: userId,
      seenBy: { $nin: [userId] },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};
