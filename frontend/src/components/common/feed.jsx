import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { Loader, MessageCircle, Send, UserRound } from "lucide-react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { handleAuthRequest } from "@/utils/api";
import { addComment, likeOrDislike, setPost } from "@/store/postSlice";
import { setAuthUser } from "@/store/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Comment from "./comment";
import DotButton from "./dotButton";

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllPost = async () => {
      const getAllPostReq = async () => {
        return await axios.get(`${API_URL}/posts/all`, 
          { withCredentials: true }
        );
      };
      const result = await handleAuthRequest(getAllPostReq, setIsLoading);
      if (result) {
        dispatch(setPost(result.data.data.visiblePosts));
      }
    };
    getAllPost();
  }, [dispatch]);

  const handleLikeDislike = async (id) => {
    try {
      const result = await axios.post(
        `${API_URL}/posts/like-dislike/${id}`,
        {},
        { withCredentials: true }
      );
      if (result.data.status === "success") {
        if (user?._id) {
          dispatch(likeOrDislike({ postId: id, userId: user._id }));
          toast.success(result.data.message);
        }
      }
    } catch (error) {
      console.error("Like/Dislike failed:", error);
      toast.error("Failed to like/dislike post.");
    }
  };

  const handleSaveUnsave = async (postId) => {
    try {
      const result = await axios.post(
        `${API_URL}/posts/save-unsave-post/${postId}`,
        {},
        { withCredentials: true }
      );
      if (result.data.status === "success") {
        dispatch(setAuthUser(result.data.data.user));
        toast.success(result.data.message);
      }
    } catch (error) {
      console.error("Save/Unsave failed:", error);
      toast.error("Failed to save/unsave post.");
    }
  };

  const handleComment = async (postId) => {
    if (!comment[postId]) return;
    const addCommentReq = async () => {
      return await axios.post(
        `${API_URL}/posts/comment/${postId}`,
        { text: comment[postId] },
        { withCredentials: true }
      );
    };
    const result = await handleAuthRequest(addCommentReq);
    if (result?.data.status === "success") {
      dispatch(addComment({ postId, comment: result?.data.data.comment }));
      toast.success("Comment Posted");
      setComment((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (posts.length < 1) {
    return (
      <div className="text-3xl m-8 text-center capitalize font-bold">
        No Posts
      </div>
    );
  }

  return (
    <div className="mt-20 w-[70%] mx-auto">
      {posts.map((post) => (
        <div key={post._id} className="mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={post.user?.profilePicture}
                  className="h-full w-full"
                />
                <AvatarFallback>
                  <UserRound size={20} />
                </AvatarFallback>
              </Avatar>
              <h1>{post.user?.username}</h1>
            </div>
            <DotButton post={post} user={user} />
          </div>
          <div className="mt-2">
            {post.image?.url ? (
              <img
                src={post.image.url}
                alt="Post"
                width={400}
                height={400}
                className="w-full max-h-[500px] object-contain rounded"
              />
            ) : post.video?.url ? (
              <video
                src={post.video.url}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate nofullscreen"
                width={400}
                height={400}
                className="w-full max-h-[500px] object-contain rounded"
              />
            ) : null}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user?._id && post.likes.includes(user._id) ? (
                <HeartSolid
                  className="w-6 h-6 text-red-500 cursor-pointer"
                  onClick={() => handleLikeDislike(post._id)}
                />
              ) : (
                <HeartOutline
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleLikeDislike(post._id)}
                />
              )}
              <MessageCircle className="cursor-pointer" />
              <Send className="cursor-pointer" />
            </div>
            {user?.savedPosts?.includes(post._id) ? (
              <BookmarkSolid
                onClick={() => handleSaveUnsave(post._id)}
                className="w-6 h-6 cursor-pointer"
              />
            ) : (
              <BookmarkOutline
                onClick={() => handleSaveUnsave(post._id)}
                className="w-6 h-6 cursor-pointer"
              />
            )}
          </div>
          <h1 className="mt-2 text-sm font-semibold">
            {post.likes.length} likes
          </h1>
          <p className="mt-2 font-medium">{post.caption}</p>
          <Comment post={post} user={user} />
          <div className="mt-2 flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 placeholder:text-gray-800 outline-none"
              value={comment[post._id] || ""}
              onChange={(e) =>
                setComment((prev) => ({
                  ...prev,
                  [post._id]: e.target.value,
                }))
              }
            />
            <p
              role="button"
              className="text-sm font-semibold text-blue-700 cursor-pointer"
              onClick={() => {
                handleComment(post._id);
              }}
            >
              Post
            </p>
          </div>
          <div className="pb-6 border-b-2"></div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
