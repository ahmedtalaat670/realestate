import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomOtpGenerator, sendEmail } from "../helpers/nodemailer.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existedUser = await User.findOne({
      $or: [{ name: username }, { email }],
    });
    if (existedUser)
      return res
        .status(400)
        .json({ message: "there is another user with the same email or name" });
    const otp = randomOtpGenerator();
    const otpExpiryDate = Date.now() + 1000 * 60 * 60 * 2;
    const hashedPassword = await bcrypt
      .hash(password, 10)
      .catch((e) => console.log(e));
    const user = await User.create({
      name: username,
      email,
      password: hashedPassword,
      otp,
      otpExpiryDate,
      isVerified: false,
    });
    sendEmail(email, otp);
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 1000 * 60 * 60 * 24 * 7 }
    );
    res
      .cookie("token", token, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(201)
      .json({
        message: "you created new account successfully",
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          verified: user.isVerified,
          savedPosts: user.savedPosts,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
    });
  }
};

export const verifyingCode = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "There is no user with this email" });
    if (user.isVerified)
      return res
        .status(400)
        .json({ message: "your email is already verified" });
    if (user.otp !== Number(otp))
      return res
        .status(400)
        .json({ message: "the verification code is wrong, try again." });
    if (user.otpExpiryDate < Date.now()) {
      const newOtp = randomOtpGenerator();
      user.otp = newOtp;
      sendEmail(email, otp);
      user.otpExpiryDate = Date.now() + 1000 * 60 * 60 * 2;
      await user.save();
      return res.status(400).json({
        message:
          "your verification code is expired, check your email for the new code",
      });
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "you verified your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ name: username });
    if (!user)
      return res
        .status(404)
        .json({ message: "there is no user with this name" });
    const isUserValid = await bcrypt.compare(password, user.password);
    if (!isUserValid)
      return res.status(400).json({ message: "The password is wrong" });
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 1000 * 60 * 60 * 24 * 7 }
    );
    res
      .cookie("token", token, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(201)
      .json({
        message: "you logged in successfully",
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          verified: user.isVerified,
          savedPosts: user.savedPosts,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
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
      return res.status(200).json(user);
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
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
