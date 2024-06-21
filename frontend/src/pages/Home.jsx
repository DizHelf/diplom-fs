import { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { useDispatch, useSelector } from "react-redux";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { fetchPosts } from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);

  const isPostsLoading = posts.status === "loading" ? true : false;

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const questFilter = (item) => {
    if (
      (userData === null) |
      (item.tags[0] === "Всем") |
      (userData?.userClass === "Учитель") |
      (item.tags[0] === userData?.userClass)
    )
      return true;
    return false;
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={0}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {isPostsLoading
            ? [...Array(5)].map((obj, index) => (
                <Post key={index} isLoading={true} />
              ))
            : posts.items
                .filter((obj) => questFilter(obj))
                .map((obj) => (
                  <Post
                    id={obj._id}
                    title={obj.title}
                    imageUrl={obj.imageUrl}
                    user={obj.user}
                    createdAt={obj.createdAt}
                    viewsCount={obj.viewsCount}
                    commentsCount={obj.comments.length}
                    tags={obj.tags}
                    isEditable={userData?._id === obj.user._id}
                    isLoading={isPostsLoading}
                    key={obj._id}
                  />
                ))}
        </Grid>
      </Grid>
    </>
  );
};
