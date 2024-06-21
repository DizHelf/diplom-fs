import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatMessage",
        default: [],
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", ChatSchema);
