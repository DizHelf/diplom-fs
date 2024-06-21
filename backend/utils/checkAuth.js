import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s/, "");
    if (!token) {
      return res.status(403).json({
        massage: "нет доступа",
      });
    }

    const decoded = await jwt.verify(token, "secret111");

    req.userId = decoded._id;

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({
      massage: "нет доступа",
    });
  }
};
