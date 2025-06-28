import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bookmark, Grid, Loader, MenuIcon } from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_API;
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { cn } from "@/lib/utils";
import { handleAuthRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useFollowUnfollow } from "@/hooks/useAuth";
import LeftBar from "@/components/common/leftBar";
import Post from "@/components/common/post";
import Saved from "@/components/common/saved";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleFollowUnfollow } = useFollowUnfollow();
  const user = useSelector((state) => state.auth.user);
  const [postOrSave, setPostOrSave] = useState("POST");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState();

  const isOwnProfile = user?._id === id;
  const isFollowing = user?.following.includes(id);

  useEffect(() => {
    if (!user) {
      return navigate("/auth/login");
    }
    const getUser = async () => {
      const getUserReq = async () => {
        return await axios.get(`${API_URL}/users/profile/${id}`, {
          withCredentials: true,
        });
      };
      const result = await handleAuthRequest(getUserReq, setIsLoading);
      if (result) {
        setUserProfile(result?.data.data.user);
      }
    };
    getUser();
  }, [user, navigate, id]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex mb-20">
        <div className="w-[16%] hidden md:block border-r-2 h-screen fixed">
          <LeftBar />
        </div>
        <div className="flex-1 md:ml-[20%] overflow-y-auto">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <MenuIcon />
              </SheetTrigger>
              <SheetContent>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
                <LeftBar />
              </SheetContent>
            </Sheet>
          </div>
          <div className="w-[90%] sm:w-[80%] mx-auto">
            <div className="mt-8 flex sm:flex-row flex-col items-center justify-center pb-8 border-b-2 md:space-x-20">
              <Avatar className="w-[8rem] h-[8rem] mb-8 md:mb-0">
                <AvatarImage
                  src={userProfile?.profilePicture}
                  className="w-full h-full rounded-full"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="lg:-ml-10">
                <div className="flex sm:flex-row flex-col items-center justify-center md:space-x-8">
                  <h1 className="text-2xl font-bold">
                    {userProfile?.username}
                  </h1>
                  {isOwnProfile && (
                    <Link to={`/profile/edit-profile/${user?._id}`}>
                      <Button variant={"secondary"} className="cursor-pointer">
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                  {!isOwnProfile && (
                    <Button
                      className="cursor-pointer"
                      variant={isFollowing ? "destructive" : "seccondary"}
                      onClick={() => handleFollowUnfollow(id)}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                  <div className="flex items-center space-x-8 mt-6 mb-6">
                    <div>
                      <span className="font-bold">
                        {userProfile?.posts.length}
                      </span>
                      <span> Posts</span>
                    </div>
                    <div>
                      <span className="font-bold">
                        {userProfile?.followers.length}
                      </span>
                      <span> Followers</span>
                    </div>
                    <div>
                      <span className="font-bold">
                        {userProfile?.following.length}
                      </span>
                      <span> Following</span>
                    </div>
                  </div>
                </div>
                <p className="lg:w-[80%] font-medium flex items-center justify-center lg:justify-start">
                  {userProfile?.bio || "My Profile Bio Here"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div className="flex items-center justify-center space-x-14">
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-pointer",
                  postOrSave === "POST" && "text-blue-500"
                )}
                onClick={() => setPostOrSave("POST")}
              >
                <Grid />
                <span className="font-semibold">Post</span>
              </div>
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-pointer",
                  postOrSave === "SAVE" && "text-blue-500"
                )}
                onClick={() => setPostOrSave("SAVE")}
              >
                <Bookmark />
                <span className="font-semibold">Saved</span>
              </div>
            </div>
            {postOrSave === "POST" && <Post userProfile={userProfile} />}
            {postOrSave === "SAVE" && <Saved userProfile={userProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
