const express = require("express");
const {
  signup,
  verifyAccount,
  resendOtp,
  login,
  logout,
  forgetPassword,
  resetPassword,
  changePassword,
  signout,
} = require("../controllers/auth");
const {
  getProfile,
  editProfile,
  suggestedUser,
  followUnfollow,
  getMe,
  updateThemePreference,
  searchUsers,
} = require("../controllers/user");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../middleware/multer");
const restrictTo = require("../middleware/restrictTo");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", isAuthenticated, verifyAccount);
router.post("/resend-otp", isAuthenticated, resendOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", isAuthenticated, changePassword);
router.delete("/signout", isAuthenticated, signout);

router.get("/profile/:id", isAuthenticated, getProfile);
router.post("/edit-profile", isAuthenticated, restrictTo("celebrity"), upload.single("profilePicture"), editProfile);
router.get("/suggested-user", isAuthenticated, suggestedUser);
router.post("/follow-unfollow/:id", isAuthenticated, followUnfollow);
router.get("/me", isAuthenticated, getMe);
router.post("/update-theme", isAuthenticated, updateThemePreference);
router.get("/search-user", searchUsers);

module.exports = router;
