import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: {
      required: true,
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      required: true,
      type: String,
    },
    likesUser: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", CommentSchema);
