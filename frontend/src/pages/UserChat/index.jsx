import style from "./style.module.scss";
import ChatInput from "./ChatInput";
import ChatBlock from "./ChatBlock";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const UserChat = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState([]);
  const myId = useSelector((state) => state.auth.data?._id);
  const navigate = useNavigate();

  const getMessages = async () => {
    try {
      setLoading(true);
      const items = await axios.get(`/messages/${id}`);
      setChat(items.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert("не удалось зайти в чат");
      navigate("/");
    }
  };

  const connectSocket = () => {
    const newSocket = io("http://localhost:4444", {
      query: { id },
    });

    setSocket(newSocket);

    newSocket.on("newMessage", (message) => {
      setChat((prevData) => ({
        ...prevData,
        comments: [...prevData.comments, message],
      }));
      console.log(message);
    });
    return () => newSocket.close();
  };

  const sendMessage = (text) => {
    try {
      socket.emit("newMessage", {
        chatId: id,
        senderId: myId,
        content: text,
      });
    } catch (error) {
      console.log(123);
      alert("не удалось отправить сообщение");
    }
  };

  useEffect(() => {
    getMessages();
    connectSocket();
  }, [id]);

  return (
    <div className={style.UserChat}>
      <ChatBlock loading={loading} messages={chat.comments} />
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default UserChat;
