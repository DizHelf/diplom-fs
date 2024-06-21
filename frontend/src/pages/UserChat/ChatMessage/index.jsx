import style from "./style.module.scss";

const ChatMessage = ({ isMyMessage, text, senderName }) => {
  return (
    <li className={isMyMessage ? style.myMessage : style.senderMessage}>
      <h3 className={isMyMessage ? style.myTitle : style.senderTitle}>
        {senderName}
      </h3>
      <p className={style.text}>{text}</p>
    </li>
  );
};

export default ChatMessage;
