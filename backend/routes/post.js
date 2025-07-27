const express = require("express");
const {
  createPost,
  getAllPost,
  getUserPosts,
  saveOrUnsavePost,
  deletePost,
  likeOrDislikePost,
  addComment,
  getCaption,
  searchPosts,
} = require("../controllers/post");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../middleware/multer");
const restrictTo = require("../middleware/restrictTo");

const router = express.Router();

router.post("/create-post", isAuthenticated, restrictTo("celebrity"), upload.array("media", 10), createPost);
router.get("/all", isAuthenticated, getAllPost);
router.get("/user-post/:id", getUserPosts);
router.post("/save-unsave-post/:postId", isAuthenticated, restrictTo("public"), saveOrUnsavePost);
router.delete("/delete-post/:id", isAuthenticated, deletePost);
router.post("/like-dislike/:id", isAuthenticated, likeOrDislikePost);
router.post("/comment/:id", isAuthenticated, addComment);
router.post("/generate-caption", isAuthenticated, restrictTo("celebrity"), getCaption);
router.get("/search-post", isAuthenticated, searchPosts);

module.exports = router;
