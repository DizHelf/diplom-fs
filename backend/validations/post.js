import { body } from "express-validator";

export const createPostValidations = [
  body("title", "введите заголовок").isLength({ min: 3 }).isString(),
  body("text", "введите описание статьи").isLength({ min: 10 }).isString(),
  body("tags", "нет тегов").optional().isArray(),
  body("imageUrl", "неверная ссылка на изоброжение").optional().isString(),
];
