import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomOtpGenerator, sendEmail } from "../helpers/nodemailer.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existedUser = await User.findOne({
      $or: [{ name: username }, { email: normalizedEmail }],
    });

    if (existedUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
      })
      .status(201)
      .json({
        message: "Account created successfully",
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          savedPosts: user.savedPosts,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret is not defined");
    }

    const user = await User.findOne({
      name: username,
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const isUserValid = await bcrypt.compare(password, user.password);

    if (!isUserValid) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
      })
      .status(200)
      .json({
        message: "Logged in successfully",
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          savedPosts: user.savedPosts,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const isLoggedIn = async (req, res) => {
  const userId = req.userId;
  try {
    if (userId) {
      const user = await User.findById(userId, {
        name: 1,
        avatar: 1,
        savedPosts: 1,
        email: 1,
        isVerified: 1,
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json(user);
    } else {
      return res.status(401).json({ message: "You are not authenticated" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong in authorization",
    });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    })
    .status(200)
    .json({ message: "Logout successful" });
};
