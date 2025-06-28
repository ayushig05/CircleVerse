import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { handleAuthRequest } from "@/utils/api";
import { setPost } from "@/store/postSlice";
import { Bookmark, HeartIcon, Loader, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DotButton from "./dotButton";
import Comment from "./comment";
const API_URL = import.meta.env.VITE_BACKEND_API;

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllPost = async () => {
      const getAllPostReq = async () => {
        return await axios.get(`${API_URL}/posts/all`);
      };
      const result = await handleAuthRequest(getAllPostReq, setIsLoading);
      if (result) {
        dispatch(setPost(result.data.data.posts));
      }
    };
    getAllPost();
  }, [dispatch]);

  const handleLikeDislike = async () => {};

  const handleSaveUnsave = async () => {};

  const handleComment = async () => {};

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
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1>{post.user?.username}</h1>
            </div>
            <DotButton post={post} user={user} />
          </div>
          <div className="mt-2">
            <img
              src={`${post.image?.url}`}
              alt="Post"
              width={400}
              height={400}
              className="w-full"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <HeartIcon className="cursor-pointer" />
              <MessageCircle className="cursor-pointer" />
              <Send className="cursor-pointer" />
            </div>
            <Bookmark className="cursor-pointer" />
          </div>
          <h1 className="mt-2 text-sm font-semibold">
            {post.likes.length} likes
          </h1>
          <p className="mt-2 font-medium">{post.caption}</p>
          <Comment post={post} user={user}/>
          <div className="mt-2 flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 placeholder:text-gray-800 outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
