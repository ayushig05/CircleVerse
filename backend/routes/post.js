const express = require("express");
const {
  createPost,
  getAllPost,
  getUserPosts,
  saveOrUnsavePost,
  deletePost,
  likeOrDislikePost,
  addComment,
  createVideoPost,
  getCaption,
} = require("../controllers/post");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/create-post", isAuthenticated, upload.single("image"), createPost);
router.post("/create-video-post", isAuthenticated,upload.single("video"), createVideoPost);
router.get("/all", getAllPost);
router.get("/user-post/:id", getUserPosts);
router.post("/save-unsave-post/:postId", isAuthenticated, saveOrUnsavePost);
router.delete("/delete-post/:id", isAuthenticated, deletePost);
router.post("/like-dislike/:id", isAuthenticated, likeOrDislikePost);
router.post("/comment/:id", isAuthenticated, addComment);
router.post("/generate-caption", getCaption);

module.exports = router;
