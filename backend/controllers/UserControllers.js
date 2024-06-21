import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { email, password, fullName, avatarUrl, userClass } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email,
      fullName,
      avatarUrl,
      passwordHash,
      userClass,
    });

    const user = await doc.save();

    const token = await jwt.sign(
      {
        _id: user._id,
      },
      "secret111",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash: userPass, ...userParams } = user._doc;

    res.json({
      ...userParams,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "не удалость зарегестрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        massage: "неверный логин или пароль",
      });
    }

    const identPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!identPass) {
      return res.status(400).json({
        massage: "неверный логин или пароль",
      });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
      },
      "secret111",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash: userPass, ...userParams } = user._doc;

    res.json({
      ...userParams,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "не удалось войти в акаунт",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).populate("chats");

    if (!user || user === null) {
      return res.status(404).json({
        massage: "пользователь не найлен",
      });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
      },
      "secret111",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash: userPass, ...userParams } = user._doc;

    res.json({
      ...userParams,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      massage: "нет доступа",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    const newUsers = users.map(({ _doc }) => {
      const { passwordHash, ...args } = _doc;

      return { ...args };
    });
    res.json(newUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "не удалось получить статьи",
    });
  }
};
