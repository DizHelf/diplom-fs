import React, { useState } from "react";
import style from "./style.module.scss";
import { Button } from "@mui/material";
import axios from "../../axios";

const AddChatBlock = ({
  loading,
  suggestions,
  inputValue,
  handleChangeInput,
  handleSubmit,
  handleSuggestionClick,
}) => {
  return (
    <div className={style.MessageBlock}>
      {loading ? (
        <></>
      ) : (
        <form onSubmit={handleSubmit} className={style.form}>
          <input
            type="text"
            value={inputValue}
            onChange={handleChangeInput}
            placeholder="Выберите человека из списка"
            className={style.input}
          />
          {suggestions.length > 0 && (
            <ul className={style.suggestions}>
              {suggestions.map(({ fullName, _id, userClass }) => (
                <li
                  key={_id}
                  onClick={() =>
                    handleSuggestionClick(`${fullName} ${userClass}`, _id)
                  }
                >
                  {`${fullName} ${userClass}`}
                </li>
              ))}
            </ul>
          )}
          <Button type="submit" variant="contained">
            Создать чат
          </Button>
        </form>
      )}
    </div>
  );
};

export default AddChatBlock;
