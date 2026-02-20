import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: String,
    avatar: {
      type: String,
      default: null,
    },
    otp: Number,
    otpExpiryDate: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },

    avatar_id: String,
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
