import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    message: {
      required: true,
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ChatMessage", ChatMessageSchema);
