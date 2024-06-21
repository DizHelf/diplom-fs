import { body } from "express-validator";

export const loginValidations = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "неверный формат пароля").isLength({ min: 6 }),
];

export const registerValidations = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "неверный формат пароля").isLength({ min: 6 }),
  body("fullName", "заполните имя").isLength({ min: 3 }),
  body("avatarUrl", "неверная ссылка").optional().isURL(),
  body("userClass", "неверный формат класса").isString(),
];
