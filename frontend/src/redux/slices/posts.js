import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("posts");
  return data;
});

export const deletePostById = createAsyncThunk(
  "posts/deletePostById",
  async (id) => await axios.delete(`/posts/${id}`)
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, actions) => {
      state.posts.items = actions.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    [deletePostById.pending]: (state, actions) => {
      state.posts.items = state.posts.items.filter(
        (post) => post._id !== actions.meta.arg
      );
    },
  },
});

export const postsReducer = postSlice.reducer;
