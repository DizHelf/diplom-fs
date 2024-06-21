import { useState } from "react";
import style from "./style.module.scss";
import Button from "@mui/material/Button";

const ChatInput = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handlerSubmitMessage = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handlerSubmitMessage} className={style.form}>
      <input
        className={style.input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" variant="contained">
        Отправить
      </Button>
    </form>
  );
};

export default ChatInput;
