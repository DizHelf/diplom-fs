import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import MenuItem from "@mui/material/MenuItem";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => selectIsAuth(state));
  const inputRef = useRef(null);
  const arrTags = ["7", "8", "9", "10", "11", "Всем"];

  const [imageUrl, setImageUrl] = useState("");
  const [post, setPost] = useState({
    text: "",
    title: "",
    tags: "",
  });

  if (!isAuth) {
    navigate("/");
  }

  React.useEffect(() => {
    if (isEdit()) {
      getPost();
    }
  }, []);

  const isEdit = () => {
    return pathname.includes("edit");
  };

  const getPost = async () => {
    try {
      const { data } = await axios.get(`/posts/${id}`);
      setPost({
        text: data.text,
        title: data.title,
        tags: data.tags,
      });
      setImageUrl(data.imageUrl ? data.imageUrl : "");
    } catch (error) {
      alert("xне удалось получить ваш пост пожалуйста перезагрузите страницу");
    }
  };

  const handleChangeFile = async (e) => {
    try {
      let file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      alert("не удалось загрузить изоброжение");
      console.log(error);
    } finally {
      e.target.value = "";
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const isValidPost = (post) => {
    const { text, title, tags } = post;
    if (!title.length) {
      alert("заполните заголовок");
      return false;
    }
    if (!tags.length) {
      alert("выберите класс");
      return false;
    }
    if (!text.length) {
      alert("заполните текст");
      return false;
    }
    return true;
  };

  const handleChangePost = async () => {
    try {
      if (!isValidPost(post)) {
        return;
      }

      const postData = {
        ...post,
        tags: [post.tags],
        imageUrl: imageUrl,
      };

      await axios.post("/posts", postData);
      alert("вы успешно создали пост");
      navigate("/");
    } catch (error) {
      alert("не удалось загрузить пост");
      console.log(error);
    }
  };

  const handleEditPost = async () => {
    try {
      const postData = {
        ...post,
        tags: [post.tags],
        imageUrl: imageUrl,
      };

      console.log(postData);

      await axios.patch(`/posts/${id}`, postData);
      alert("вы успешно изменили пост");
      navigate("/");
    } catch (error) {
      alert("не удалось изменить пост");
      console.log(error);
    }
  };

  const onChange = React.useCallback((value) => {
    setPost((prev) => ({
      ...prev,
      text: value,
    }));
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input type="file" onChange={handleChangeFile} hidden ref={inputRef} />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img
          className={styles.image}
          src={`http://localhost:4444/${imageUrl}`}
          alt="Uploaded"
        />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        onChange={(e) =>
          setPost((prev) => ({
            ...prev,
            title: e.target.value,
          }))
        }
        value={post.title}
      />
      <TextField
        className={styles.tags}
        onChange={(e) =>
          setPost((prev) => ({
            ...prev,
            tags: e.target.value,
          }))
        }
        select
        defaultValue=""
        label="Класс"
      >
        {arrTags.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
      <SimpleMDE
        className={styles.editor}
        value={post.text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        {!isEdit() && (
          <Button size="large" onClick={handleChangePost} variant="contained">
            Опубликовать
          </Button>
        )}
        {isEdit() && (
          <Button size="large" onClick={handleEditPost} variant="contained">
            Изменить
          </Button>
        )}
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
