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
    addNewPost: (state, action) => {
      const newPost = action.payload;
      const alreadyExists = state.posts.some(
        (post) => post._id === newPost._id
      );
      if (!alreadyExists) {
        state.posts.unshift(newPost);
      }
    },
    addPost: (state, action) => {
      const newPosts = action.payload;
      newPosts.forEach((newPost) => {
        const exists = state.posts.some(
          (post) => post._id === newPost._id);
          if (!exists) {
            state.posts.push(newPost);
          }
      });
    },
    deletePosts: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post._id !== action.payload
      );
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

export const { setPost, addNewPost, addPosts, deletePosts, likeOrDislike, addComment } =
  postSlice.actions;

export default postSlice.reducer;
