import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";

import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const Registration = () => {
  const arrUserClasses = ["7", "8", "9", "10", "11", "Учитель"];

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      firstName: "Анатолий",
      lastName: "Синицын",
      userClass: arrUserClasses[0],
      email: "mustangzxc@inbox.ru",
      password: "536707Qw",
    },
    mode: "onSubmit",
  });

  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const onSubmit = async (params) => {
    const { firstName, lastName, userClass, ...res } = params;
    const newFirstName = capitalizeFirstLetter(firstName);
    const newLastName = capitalizeFirstLetter(lastName);
    const newUserClass = capitalizeFirstLetter(userClass);

    const fullName = `${newLastName} ${newFirstName}`;

    const registerInfo = {
      ...res,
      fullName,
      userClass: newUserClass,
    };

    const { payload } = await dispatch(fetchRegister(registerInfo));
    if (!payload) {
      return alert("не удалось Зарегистрироваться");
    }
    if ("token" in payload) {
      window.localStorage.setItem("token", payload.token);
    } else {
      return alert("не удалось Зарегистрироваться");
    }
  };

  if (isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 50, height: 50 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          error={Boolean(errors.firstName?.message)}
          helperText={errors.firstName?.message}
          fullWidth
          {...register("firstName", { required: "Пожалуйста укажите имя" })}
        />
        <TextField
          className={styles.field}
          label="Фамилия"
          error={Boolean(errors.lastName?.message)}
          helperText={errors.lastName?.message}
          fullWidth
          {...register("lastName", { required: "Пожалуйста укажите фамилию" })}
        />
        <TextField
          className={styles.field}
          select
          defaultValue=""
          label="Ваш клас"
          error={Boolean(errors.userClass?.message)}
          helperText={errors.userClass?.message}
          fullWidth
          {...register("userClass", {
            required: "Пожалуйста укажите свой класс",
          })}
        >
          {arrUserClasses.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          fullWidth
          {...register("email", { required: "Пожалуйста укажите email" })}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          fullWidth
          {...register("password", { required: "Пожалуйста укажите password" })}
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
