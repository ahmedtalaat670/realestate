import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    avatar_id: {
      type: String,
      default: null,
    },
    savedPosts: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

// indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
