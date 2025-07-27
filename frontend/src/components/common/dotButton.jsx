import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { Ellipsis } from "lucide-react";
import { useFollowUnfollow } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { handleAuthRequest } from "@/utils/api";
import { deletePosts } from "@/store/postSlice";
import LoadingButton from "./loader";

const DotButton = ({ post, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { handleFollowUnfollow } = useFollowUnfollow();
  const isOwnPost = post?.user?._id === user?._id;
  const isFollowing = post?.user?._id
    ? user?.following.includes(post.user._id)
    : false;

  const handleDeletePost = async () => {
    const deletePostReq = async () => {
      return await axios.delete(`${API_URL}/posts/delete-post/${post?._id}`, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(deletePostReq, setIsLoading);
    if (result?.data?.status === "success") {
      if (post?._id) {
        dispatch(deletePosts(post._id));
        toast.success(result.data.message);
        navigate("/");
      }
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Ellipsis className="w-8 h-8 cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <div className="space-y-4 flex flex-col w-fit justify-center items-center mx-auto">
            {!isOwnPost && (
              <div>
                <Button
                  variant={isFollowing ? "destructive" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (post?.user?._id) handleFollowUnfollow(post?.user._id);
                  }}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            )}
            <Link to={`/profile/${post?.user?._id}`}>
              <Button variant={"secondary"} className="cursor-pointer">
                About This Account
              </Button>
            </Link>
            {isOwnPost && (
              <LoadingButton
                variant={"destructive"}
                onClick={handleDeletePost}
                isLoading={isLoading}
                className="cursor-pointer"
              >
                Delete Post
              </LoadingButton>
            )}
            <DialogClose>
              <Button className="bg-gray-500 text-white hover:bg-gray-600 cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DotButton;
