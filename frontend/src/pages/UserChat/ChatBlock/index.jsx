import style from "./style.module.scss";
import ChatMessage from "../ChatMessage";
import { useSelector } from "react-redux";

const ChatBlock = ({ messages, loading }) => {
  const myId = useSelector((state) => state.auth.data?._id);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isMyMessage = (senderId) => {
    if (myId === senderId) return true;
    else return false;
  };

  return (
    <div className={style.ChatBlock}>
      <ul className={style.userList}>
        {messages.map((message) => (
          <ChatMessage
            key={message._id}
            isMyMessage={isMyMessage(message.sender._id)}
            text={message.message}
            senderName={`${message.sender.fullName} (${message.sender.userClass})`}
          />
        ))}
      </ul>
    </div>
  );
};

export default ChatBlock;
