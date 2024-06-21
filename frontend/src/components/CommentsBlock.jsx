import React, { useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from "react-redux";

export const CommentsBlock = ({
  items,
  children,
  isLoading = true,
  onClickRemove,
  onClickUpdate,
}) => {
  const { data } = useSelector((state) => state.auth);

  const isAuthor = (id) => data?._id === id;

  return (
    <SideBlock title="Комментарии">
      <List>
        {isLoading
          ? [...Array(5)]
          : items.map((obj, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    {isLoading ? (
                      <Skeleton variant="circular" width={40} height={40} />
                    ) : (
                      <Avatar
                        alt={obj.user.fullName}
                        src={obj.user.avatarUrl}
                      />
                    )}
                  </ListItemAvatar>
                  {isLoading ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Skeleton variant="text" height={25} width={120} />
                      <Skeleton variant="text" height={18} width={230} />
                    </div>
                  ) : (
                    <ListItemText
                      primary={obj.user.fullName}
                      secondary={obj.text}
                    />
                  )}
                  {isAuthor(obj.user._id) && (
                    <>
                      <IconButton
                        onClick={() => onClickUpdate(obj._id, obj.text)}
                        color="secondary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onClickRemove(obj._id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
      </List>
      {children}
    </SideBlock>
  );
};
