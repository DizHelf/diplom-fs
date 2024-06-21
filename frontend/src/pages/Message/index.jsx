import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import style from "./style.module.scss";
import AddChatBlock from "../../components/AddChatBlock";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const Message = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [friendId, setFriendId] = useState("");
  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = allUsers.filter(({ fullName }) =>
        fullName.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion, id) => {
    setInputValue(suggestion);
    setFriendId(id);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const chat = await axios.post("/messages", { friendId });
      navigate(`/messages/${chat.data._id}`);
    } catch (error) {
      console.log(error);
      alert("не удалось создать чат");
    }
  };

  const getMyChats = async () => {
    const myChats = await axios.get("/messages");
    setChats(myChats.data);
  };

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const users = await axios.get("/auth");
      setAllUsers(users.data);
      getMyChats();
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("пожалуйста перезагрузите страницу");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className={style.messagePage}>
      <Sidebar chats={chats} loading={loading} />
      <AddChatBlock
        suggestions={suggestions}
        inputValue={inputValue}
        loading={loading}
        handleChangeInput={handleChangeInput}
        handleSuggestionClick={handleSuggestionClick}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Message;
