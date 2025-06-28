import React from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Link } from "react-router-dom";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";

const DotButton = ({ post, user }) => {
  const dispatch = useDispatch();
  const isOwnPost = post?.user?._id === user?._id;
  const isFollowing = post?.user?._id
    ? user?.following.includes(post.user._id)
    : false;

  const handleDeletePost = async () => {};

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Ellipsis className="w-8 h-8 text-black" />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <div className="space-y-4 flex flex-col w-fit justify-center items-center mx-auto">
            {!isOwnPost && (
              <div>
                <Button variant={isFollowing ? "destructive" : "secondary"}>
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
              <Button
                variant={"destructive"}
                onClick={handleDeletePost}
                className="cursor-pointer"
              >
                Delete Post
              </Button>
            )}
            <DialogClose className="cursor-pointer">Cancel</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DotButton;
