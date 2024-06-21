import React from "react";
import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuth, logout, selectIsTeacher } from "../../redux/slices/auth";

export const Header = () => {
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const isTeacher = useSelector(selectIsTeacher);
  const dispatch = useDispatch();

  const onClickLogout = () => {
    if (window.confirm("Вы дествительно хотите выйти")) {
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Главная</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link className={styles.massageLink} to={"/messages"}>
                  <img
                    className={styles.massageImg}
                    src="/svg/message.png"
                    alt="message"
                  />
                </Link>
                {isTeacher && (
                  <Link to="/add-post">
                    <Button variant="contained">Написать статью</Button>
                  </Link>
                )}
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
