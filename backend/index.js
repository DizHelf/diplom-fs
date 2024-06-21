import express from "express";
import mongoose from "mongoose";
import { registerValidations, loginValidations } from "./validations/auth.js";
import { createPostValidations } from "./validations/post.js";
import checkAuth from "./utils/checkAuth.js";
import checkErrors from "./utils/checkErrors.js";
import isUserChat from "./utils/isUserChat.js";
import {
  login,
  register,
  getMe,
  getAllUsers,
} from "./controllers/UserControllers.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./controllers/PostControllers.js";
import {
  createComment,
  removeComment,
  likeComment,
  updateComment,
} from "./controllers/CommentControllers.js";
import { createChat, getMyChats } from "./controllers/ChatControllers.js";
import multer from "multer";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  createMessage,
  getChatMessages,
} from "./controllers/ChatMessageController.js";

mongoose
  .connect("mongodb+srv://admin:wwwwww@diplom.zw5kmps.mongodb.net/blog")
  .then(() => console.log("bd ok"))
  .catch((err) => console.log("bd error", err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = decodeURIComponent(escape(file.originalname));
    cb(null, filename);
  },
});

const app = express();
const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.post("/auth/login", loginValidations, checkErrors, login);
app.post("/auth/register", registerValidations, checkErrors, register);
app.get("/auth/me", checkAuth, getMe);
app.get("/auth", getAllUsers);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, createPostValidations, checkErrors, update);
app.post("/posts", checkAuth, createPostValidations, checkErrors, create);

app.get("/tags");

app.post("/comment", checkAuth, createComment);
app.delete("/comment/:id", checkAuth, removeComment);
app.patch("/comment/like/:id", checkAuth, likeComment);
app.patch("/comment/:id", checkAuth, updateComment);

app.post("/messages", checkAuth, createChat);
app.get("/messages", checkAuth, getMyChats);
app.get("/messages/:id", checkAuth, isUserChat, getChatMessages);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  const filename = decodeURIComponent(escape(req.file.originalname));
  res.json({
    url: `uploads/${filename}`,
  });
});
app.post("/upload", checkAuth, upload.single("file"), (req, res) => {
  const filename = decodeURIComponent(escape(req.file.originalname));
  res.json({
    url: `uploads/${filename}`,
  });
});

const http = createServer(app);

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  const chatId = socket.handshake.query.id;
  socket.join(chatId);
  socket.on("newMessage", async (data) => {
    await createMessage(data, socket, io);
  });
});

http.listen(4444, (err) => {
  if (err) {
    return console.log(`server error: ${err}`);
  }

  console.log("server ok");
});
