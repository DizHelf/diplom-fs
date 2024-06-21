import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import style from "./Sidebar.module.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";

const Sidebar = ({ chats, loading }) => {
  const userInfo = useSelector((state) => state.auth.data);

  const getChatName = (arr) => {
    const user = arr.filter((user) => userInfo?._id !== user._id);
    return `${user[0].fullName} (${user[0].userClass})`;
  };

  return (
    <div className={style.sidebar}>
      <h3 className={style.titleSidebar}>Ваши чаты</h3>
      <ul className={style.chats}>
        {!loading &&
          chats.map(({ _id, users }) => (
            <li className={style.listItem} key={_id}>
              <Link className={style.link} to={_id}>
                {getChatName(users)}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
