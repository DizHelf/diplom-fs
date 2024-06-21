import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.body.postId;

    if (req.body.text.length === 0) {
      return res.json({
        massage: "коментарий успешно удалён",
      });
    }

    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      postId,
    });

    const post = await PostModel.findById({
      _id: postId,
    });

    const user = await UserModel.findById({
      _id: req.userId,
    });

    if (!post) {
      return res.status(404).json({
        massage: "не удалость оставить коментарий под этим постом",
      });
    }

    if (!user) {
      return res.status(404).json({
        massage: "не удалость оставить коментарий под этим постом",
      });
    }

    const comment = await doc.save();
    post.comments.push(comment._id);
    await post.save();

    res.json({ ...comment._doc, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "не удалось создать пост",
    });
  }
};

export const removeCommentFromPost = async (postId, commentId) => {
  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new Error("Данный пост был удалён");
    }

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save();
  } catch (error) {
    throw new Error(error.message || "Не удалось удалить комментарий");
  }
};

export const removeCommentFromDatabase = async (commentId) => {
  try {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      throw new Error("Данный комментарий был удалён");
    }

    await CommentModel.deleteOne({ _id: commentId });
  } catch (error) {
    throw new Error(error.message || "Не удалось удалить комментарий");
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const postId = req.body.postId;

    await removeCommentFromPost(postId, commentId, res);
    await removeCommentFromDatabase(commentId, res);

    res.json({
      message: "Комментарий успешно удалён",
    });
  } catch (error) {
    if (
      error.message === "Данный пост был удалён" ||
      error.message === "Данный комментарий был удалён"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    } else {
      console.log(error);
      return res.status(500).json({
        message: "Произошла ошибка на сервере",
      });
    }
  }
};

export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;

    const comment = await CommentModel.findById({
      _id: commentId,
    });

    if (!comment) {
      return res.status(404).json({
        massage: "данный коментарий был удалён",
      });
    }

    if (comment.likesUser.includes(userId)) {
      comment.likesUser = comment.likesUser.filter(
        (id) => id.toString() !== userId
      );
      comment.likesCount -= 1;
      comment.save();

      return res.json({
        massage: "лайк успешно убран",
      });
    } else {
      comment.likesUser.push(userId);
      comment.likesCount += 1;
      comment.save();

      return res.json({
        massage: "лайк успешно проставлен",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Произошла ошибка на сервере",
    });
  }
};

export const updateComment = async (req, res) => {
  console.log(req.body.text);
  try {
    const commentId = req.params.id;

    await CommentModel.updateOne(
      {
        _id: commentId,
      },
      {
        text: req.body.text,
      }
    );

    res.json({
      massage: "пост успешно обнавлён",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Произошла ошибка на сервере",
    });
  }
};
