import PostModel from "../models/Post.js";
import { removeCommentFromDatabase } from "./CommentControllers.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "не удалось создать пост",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    )
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .exec()
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({ message: "Статья не найдена" });
        }
        return res.json(doc);
      })
      .catch((err) => {
        console.err(err);
        return res.status(500).json({ message: "Не удалось получить статью" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "не удалось получить статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findById({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        massage: "данная статья удалена",
      });
    }

    doc.comments.forEach((comment) => {
      removeCommentFromDatabase(comment._id);
    });

    await PostModel.deleteOne({ _id: postId });

    res.json({
      massage: "пост успешно удалён",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "не удалось удалить статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "не удалось обновить статью",
    });
  }
};
