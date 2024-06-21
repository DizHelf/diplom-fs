import ChatModel from "../models/Chat.js";
import UserModel from "../models/User.js";

export const createChat = async (req, res) => {
  try {
    const { friendId } = req.body;

    if (friendId === req.userId) {
      return res.status(500).json({
        message: "нельзя создать чат с самим собой",
      });
    }

    const friend = await UserModel.findById(friendId);
    if (!friend) {
      return res.status(404).json({
        message: "Пользователь-друг не найден",
      });
    }

    const me = await UserModel.findById(req.userId);
    if (!me) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const doc = new ChatModel({
      users: [friend._id, me._id],
    });

    const chat = await doc.save();

    await UserModel.findByIdAndUpdate(me._id, { $push: { chats: chat._id } });
    await UserModel.findByIdAndUpdate(friend._id, {
      $push: { chats: chat._id },
    });

    const { _doc } = await ChatModel.findById(chat._id).populate(
      "users",
      "-passwordHash"
    );

    res.json({
      ..._doc,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "не удалость создать чат",
    });
  }
};

export const getMyChats = async (req, res) => {
  try {
    const { userId } = req;
    const user = await UserModel.findById(userId)
      .populate({
        path: "chats",
        populate: {
          path: "users",
          model: "User",
        },
      })
      .exec();

    res.json([...user.chats]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "не удалость получить чаты",
    });
  }
};
