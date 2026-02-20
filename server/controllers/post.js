import jwt from "jsonwebtoken";
import Post from "../models/post.js";
import mongoose, { Types } from "mongoose";
import User from "../models/user.js";
export const getPosts = async (req, res) => {
  try {
    const query = req.query;

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = {
      ...(query.city && { city: query.city }),
      ...(query.type && { type: query.type }),
      ...(query.property && { property: query.property }),
      ...(query.bedroom && { bedroom: parseInt(query.bedroom) }),
      ...((query.minPrice || query.maxPrice) && {
        price: {
          ...(query.minPrice && { $gte: parseInt(query.minPrice) }),
          ...(query.maxPrice && { $lte: parseInt(query.maxPrice) }),
        },
      }),
    };

    const posts = await Post.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    const token = req.cookies.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err)
          return res.status(403).json({ message: "you are not authorized" });

        posts.forEach((post) => {
          if (post.savingUsers?.includes(payload.userId)) {
            post.isSaved = true;
          }
        });

        return res.status(200).json({
          posts,
          totalPages,
        });
      });
    } else {
      return res.status(200).json({
        posts,
        totalPages,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findOne({ _id: postId }).populate(
      "userId",
      "name email avatar"
    );
    if (!post)
      return res.status(404).json({ message: "there is no post with this id" });
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(403).json({ message: "token is not valid" });
        const userId = new Types.ObjectId(payload.userId);
        const isSaved = post.savingUsers.includes(userId);
        if (isSaved) {
          post.isSaved = true;
        }
        return res.status(200).json({ post });
      });
    } else {
      return res.status(200).json({ post });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const userId = new Types.ObjectId(body.userId);

  try {
    const postBody = { ...body, userId };
    console.log(postBody);

    const newPost = await Post.create(postBody);
    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id);
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const savePost = async (req, res) => {
  const id = req.params.id;
  try {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(403).json({ message: "you are not authorized" });
        } else {
          const post = await Post.findById(id);
          const saved = post.savingUsers.includes(payload.userId);
          if (saved) {
            await Post.findByIdAndUpdate(id, {
              $pull: { savingUsers: new Types.ObjectId(payload.userId) },
            });
            await User.findByIdAndUpdate(payload.userId, {
              $pull: { savedPosts: new Types.ObjectId(id) },
            });
            res
              .status(200)
              .json({ message: "you unsaved the post successfully" });
          } else {
            await Post.findByIdAndUpdate(id, {
              $addToSet: { savingUsers: new Types.ObjectId(payload.userId) },
            });
            await User.findByIdAndUpdate(payload.userId, {
              $addToSet: { savedPosts: new Types.ObjectId(id) },
            });
            res
              .status(200)
              .json({ data: post, message: "you saved the post successfully" });
          }
        }
      });
    } else {
      res.status(401).json({ message: "you are not authenticated" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to save post" });
  }
};
