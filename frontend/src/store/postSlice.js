import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.posts = action.payload;
    },
    addPosts: (state, action) => {
      state.posts.unshift(action.payload);
    },
    deletePosts: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    likeOrDislike: (state, action) => {
      const post = state.posts.find(
        (post) => post._id === action.payload.postId
      );
      if (post) {
        const hasLiked = post.likes.includes(action.payload.userId);
        if (hasLiked) {
          post.likes = post.likes.filter((id) => id !== action.payload.userId);
        } else {
          post.likes.push(action.payload.userId);
        }
      }
    },
    addComment: (state, action) => {
      const post = state.posts.find(
        (post) => post._id === action.payload.postId
      );
      if (post) {
        post.comments.push(action.payload.comment);
      }
    },
  },
});

export const { setPost, addPosts, deletePosts, likeOrDislike, addComment } =
  postSlice.actions;

export default postSlice.reducer;
