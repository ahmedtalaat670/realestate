import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: String,
  image_id: String,
});

const postSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    images: [imageSchema],
    address: String,
    city: String,
    bedroom: Number,
    bathroom: Number,
    latitude: String,
    longitude: String,
    type: String,
    property: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postDetail: {
      desc: String,
      utilities: String,
      pet: String,
      size: Number,
      school: Number,
      bus: Number,
      restaurant: Number,
    },
    savingUsers: Array,
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
