import ChatModel from "../models/Chat.js";

export default async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const doc = await ChatModel.findById({ _id: chatId });

    if (!doc) {
      return res.status(404).json({
        message: "данный чат не найден",
      });
    }

    const usersArr = doc.users.filter(
      (user) => user._id.toString() === req.userId
    );
    console.log(usersArr);

    if (usersArr[0] === undefined) {
      return res.status(403).json({
        message: "нет доступа",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({
      massage: "нет доступа",
    });
  }
};
