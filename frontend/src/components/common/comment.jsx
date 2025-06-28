import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { handleAuthRequest } from "@/utils/api";
import { addComment } from "@/store/postSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DotButton from "./dotButton";
import { Button } from "../ui/button";

const Comment = ({ post, user }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState({});

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

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <p className="mt-2 text-sm font-semibold cursor-pointer">
            View All {post?.comments.length} Comment
          </p>
        </DialogTrigger>
        <DialogContent className="max-w-5xl p-0 gap-0 flex flex-col">
          <DialogTitle></DialogTitle>
          <div className="flex flex-1">
            <div className="sm:w-1/2 hidden max-h-[80vh] sm:block">
              <img
                src={`${post?.image?.url}`}
                alt="Post Image"
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            <div className="w-full sm:w-1/2 flex flex-col justify-between">
              <div className="flex items-center mt-8 justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src={post?.user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{post?.user?.username}</p>
                  </div>
                </div>
                <DotButton user={user} post={post} />
              </div>
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {post?.comments.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="flex mb-4 gap-3 items-center"
                    >
                      <Avatar>
                        <AvatarImage src={item?.user?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold">
                          {item?.user?.username}
                        </p>
                        <p className="font-normal text-sm">{item?.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={comment[post._id] || ""}
                    onChange={(e) =>
                      setComment((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    placeholder="Add a comment..."
                    className="w-full outline-none border text-sm boorder-gray-300 p-2 rounded cursor-pointer"
                  />
                  <Button
                    variant={"outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (post?._id) {
                        handleComment(post?._id);
                      }
                    }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comment;
