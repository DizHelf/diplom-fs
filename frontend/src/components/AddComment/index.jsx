import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const Index = ({
  AddComment,
  edit,
  handleChangeUpdateComment,
  clearCommentOptions,
  text,
  setText,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useSelector((state) => state.auth);

  const isLogin = () => {
    if (!data) {
      if (window.confirm("для создания коментария требуется войти в акаунт")) {
        navigate("/login");
      }
    }
  };

  const handleChangeComment = async () => {
    isLogin();
    if (!text.length) {
      return alert("введите текст");
    }
    const comment = {
      postId: id,
      text,
    };
    AddComment(comment);
    setText("");
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src="/noavatar.png" />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {edit ? (
            <div className={styles.buttonContainer}>
              <Button onClick={handleChangeUpdateComment} variant="contained">
                Изменить
              </Button>
              <button onClick={clearCommentOptions} className={styles.delete}>
                Отмена
              </button>
            </div>
          ) : (
            <Button onClick={handleChangeComment} variant="contained">
              Отправить
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
