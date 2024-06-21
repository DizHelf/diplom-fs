import UserModel from "../models/User.js";
import ChatMessageModel from "../models/ChatMessage.js";
import ChatModel from "../models/Chat.js";

export const getChatMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await ChatModel.findById(chatId)
      .populate("users", "-passwordHash") // Исключает пароль из вывода
      .populate({
        path: "comments",
        populate: {
          path: "sender",
          select: "-passwordHash", // Исключает пароль из вывода
        },
      });

    res.json({ ...chat._doc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const createMessage = async (data, socket, io) => {
  try {
    const user = await UserModel.findById(data.senderId);

    if (!user | (user === null)) {
      return socket.emit("error", { status: 404, message: "user not found" });
    }
    const chat = await ChatModel.findById(data.chatId);

    if (!chat) {
      return socket.emit("error", { status: 404, message: "chat not found" });
    }

    const newMessage = new ChatMessageModel({
      chat: chat,
      sender: user,
      message: data.content,
    });
    const savedMessage = await newMessage.save();

    await ChatModel.findByIdAndUpdate(data.chatId, {
      $push: { comments: savedMessage._id },
    });

    io.to(data.chatId).emit("newMessage", savedMessage);
  } catch (error) {
    console.log(error);
    socket.emit("error", {
      status: 500,
      message: "не удалось оствить сообщение",
    });
  }
};
