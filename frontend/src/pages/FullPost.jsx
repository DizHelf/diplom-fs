import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";

export const FullPost = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const [commentId, setCommentId] = useState("");

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setComments(res.data.comments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert("не удалось получить статью");
      });
  }, []);

  const AddComment = async (comment) => {
    try {
      const { data } = await axios.post("/comment", comment);

      setComments((prev) => [...prev, data]);
    } catch (error) {
      alert("не ужалось загрузить коментарий");
    }
  };

  const onClickRemoveComment = async (commentId) => {
    try {
      await axios.delete(`comment/${commentId}`, {
        data: {
          postId: id,
        },
      });
      setComments((prev) => prev.filter((item) => item._id !== commentId));
    } catch (error) {
      alert("не удалось удалить пост");
    }
  };

  const onClickUpdateComment = (commentId, text) => {
    setEdit(true);
    setText(text);
    setCommentId(commentId);
  };

  const clearCommentOptions = () => {
    setEdit(false);
    setText("");
  };

  const handleChangeUpdateComment = async () => {
    try {
      await axios.patch(`comment/${commentId}`, {
        text,
      });

      setComments((prev) =>
        prev.map((item) => (item._id === commentId ? { ...item, text } : item))
      );

      setEdit(false);
      setText("");
    } catch (error) {
      alert("не удалось изменить пост");
    }
  };

  if (loading) {
    return <Post isLoading={true} />;
  }

  return (
    <>
      <>
        <Post
          id={data._id}
          title={data.title}
          imageUrl={data.imageUrl}
          user={data.user}
          createdAt={data.createdAt}
          viewsCount={data.viewsCount}
          commentsCount={comments.length || 0}
          tags={data.tags}
          isFullPost
        >
          <p>{data.text}</p>
        </Post>
        <CommentsBlock
          onClickRemove={onClickRemoveComment}
          onClickUpdate={onClickUpdateComment}
          items={comments || []}
          isLoading={loading}
        >
          <Index
            edit={edit}
            handleChangeUpdateComment={handleChangeUpdateComment}
            AddComment={AddComment}
            text={text}
            setText={setText}
            clearCommentOptions={clearCommentOptions}
          />
        </CommentsBlock>
      </>
    </>
  );
};
