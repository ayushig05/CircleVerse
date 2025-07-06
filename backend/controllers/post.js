const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
const { uploadToCloudinary, cloudinary } = require("../utils/cloudinary");
const AppError = require("../utils/appError");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const generateCaption = require("../utils/generateCaption");

exports.createPost = catchAsync(async(req, res, next) => {
    const { caption } = req.body;
    const image = req.file;
    const userId = req.user._id;
    if (!image) {
        return next(new AppError("Image is required for the post", 400));
    }
    const optimizeImageBuffer = await sharp(image.buffer).resize({
        width: 800,
        height: 800,
        fit: "inside",
    }).toFormat("jpeg", { quality: 80 }).toBuffer();
    const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString("base64")}`;
    const cloudResponse = await uploadToCloudinary(fileUri);
    let post = await Post.create({
        caption,
        image: {
            url: cloudResponse.secure_url,
            publicId: cloudResponse.public_id,
        },
        user: userId,
    });
    const user = await User.findById(userId);
    if (user) {
        user.posts.push(post.id);
        await user.save({ validateBeforeSave: false });
    }
    post = await post.populate({
        path: "user",
        select: "username email bio profilePicture",
    });
    return res.status(201).json({
        status: "success",
        message: "Post Created",
        data: {
            post,
        },
    });
});

exports.getAllPost = catchAsync(async(req, res, next) => {
    const posts = await Post.find().populate({
        path: "user",
        select: "username profilePicture bio",
    }).populate({
        path: "comments",
        select: "text user",
        populate: {
            path: "user",
            select: "username profilePicture",
        },
    }).sort({ createdAt: -1 });
    return res.status(200).json({
        status: "success",
        results: posts.length,
        data: {
            posts,
        },
    });
});

exports.getUserPosts = catchAsync(async(req, res, next) => {
    const userId = req.params.id;
    const posts = await Post.find({ user: userId }).populate({
        path: "comments",
        select: "text user",
        populate: {
            path: "user",
            select: "username profilePicture",
        },
    }).sort({ createdAt: -1 });
    return res.status(200).json({
        status: "success",
        results: posts.length,
        data: {
            posts,
        },
    });
});

exports.saveOrUnsavePost = catchAsync(async(req, res, next) => {
    const userId = req.user._id;
    const postId = req.params.postId;
    const user = await User.findById(userId);
    if (!userId) {
        return next(new AppError("User not found", 404));
    }
    const isPostSave = user.savedPosts.includes(postId);
    if (isPostSave) {
        user.savedPosts.pull(postId);
        await user.save({ validateBeforeSave: false });
        return res.status(200).json({
            status: "success",
            message: "Post Unsaved Successfully",
            data: {
                user,
            },
        });
    } else {
        user.savedPosts.push(postId);
        await user.save({ validateBeforeSave: false });
        return res.status(200).json({
            status: "success",
            message: "Post Saved Successfully",
            data: {
                user,
            },
        });
    }
});

exports.deletePost = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id).populate("user");
    if (!post) {
        return next(new AppError("Post not found", 404));
    }
    if (post.user._id.toString() !== userId.toString()) {
        return next(new AppError("You are not authorized to delete this post", 403));
    }
    await User.updateOne(
        { _id: userId }, 
        { $pull: { posts: id } }
    );
    await User.updateMany(
        { savedPosts: id }, 
        { $pull: { savedPosts: id } }
    );
    await Comment.deleteMany({ post: id });
    if (post.image.publicId) {
        await cloudinary.uploader.destroy(post.image.publicId);
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({
        status: "success",
        message: "Post Deleted Successsfully",
    });
});

exports.likeOrDislikePost = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    if (!post) {
        return next(new AppError("Post not found", 404));
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
        await Post.findByIdAndUpdate(
            id,
            { $pull: { likes: userId } },
            { new: true },
        );
        return res.status(200).json({
            status: "success",
            message: "Post Disliked Successfully",
        });
    } else {
        await Post.findByIdAndUpdate(
            id,
            { $addToSet: { likes: userId } },
            { new: true },
        );
        return res.status(200).json({
            status: "success",
            message: "Post Liked Successfully",
        });
    }
});

exports.addComment = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const { text } = req.body;
    const post = await Post.findById(id);
    if (!post) {
        return next(new AppError("Post not found", 404));
    }
    if (!text) {
        return next(new AppError("Comment text is required", 400));
    }
    const comment = await Comment.create({
        text,
        user: userId,
        createdAt: Date.now(),
    });
    post.comments.push(comment);
    await post.save({ validateBeforeSave: false });
    await comment.populate({
        path: "user",
        select: "username profilePicture bio",
    });
    res.status(200).json({
        status: "success",
        message: "Comment Added Successfully",
        data: {
            comment,
        },
    });
});

exports.createVideoPost = catchAsync(async (req, res, next) => {
  const { caption } = req.body;
  const video = req.file;
  const userId = req.user._id;
  if (!video) {
    return next(new AppError("Video is required for the post", 400));
  }
  const fileUri = `data:${video.mimetype};base64,${video.buffer.toString("base64")}`;
  const cloudResponse = await uploadToCloudinary(fileUri, "video");
  let post = await Post.create({
    caption,
    video: {
      url: cloudResponse.secure_url,
      publicId: cloudResponse.public_id,
    },
    user: userId,
  });
  const user = await User.findById(userId);
  if (user) {
    user.posts.push(post._id);
    await user.save({ validateBeforeSave: false });
  }
  post = await post.populate({
    path: "user",
    select: "username email bio profilePicture",
  });
  return res.status(201).json({
    status: "success",
    message: "Video Post Created",
    data: { post },
  });
});

// exports.getCaption = catchAsync(async (req, res, next) => {
//   const { description } = req.body;
//   if (!description) {
//     return res.status(400).json({ 
//         status: "fail", 
//         message: "Description is required" 
//     });
//   }
//   const caption = await generateCaption(description);
//   if (!caption) {
//     return res.status(500).json({ 
//         status: "error", 
//         message: "Failed to generate caption" 
//     });
//   }
//   res.status(200).json({
//     status: "success",
//     data: { caption },
//   });
// });




exports.getCaption = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ 
        status: "fail", 
        message: "Description is required" 
    });
  }

  try {
    const caption = await generateCaption(description);
    if (!caption) {
      return res.status(500).json({ 
          status: "error", 
          message: "Failed to generate caption (null returned)" 
        });
        console.log(error);
    }
    res.status(200).json({
      status: "success",
      data: { caption },
    });
  } catch (error) {
    console.error("generateCaption failed:", error);
    res.status(500).json({
      status: "error",
      message: "Caption generation failed internally",
    });
  }
});
