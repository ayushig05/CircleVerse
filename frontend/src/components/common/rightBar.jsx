import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { BadgeCheck, Loader, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { handleAuthRequest } from "@/utils/api";

const RightBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [suggestedUser, setSuggestedUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSuggestedUser = async () => {
      const getSuggestedUserReq = async () => {
        return await axios.get(`${API_URL}/users/suggested-user`, {
          withCredentials: true,
        });
      };
      const result = await handleAuthRequest(getSuggestedUserReq, setIsLoading);
      if (result) {
        setSuggestedUser(result.data.data.users);
      }
    };
    getSuggestedUser();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <div
          onClick={() => navigate(`/profile/${user?._id}`)}
          className="flex items-center space-x-4 cursor-pointer p-2 rounded-md"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              <UserRound size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">
              {user?.username}
            </h1>
            <p className="text-gray-700 dark:text-gray-400">
              {user?.bio || "My Profile Bio Here"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5">
        <h1 className="font-semibold text-gray-700 dark:text-gray-300">
          Suggested User
        </h1>
        <h1 className="font-medium cursor-pointer text-blue-700 dark:text-blue-400">
          See All
        </h1>
      </div>
      {suggestedUser?.slice(0, 5).map((s_user) => {
        return (
          <div
            onClick={() => navigate(`/profile/${s_user._id}`)}
            key={s_user._id}
            className="mt-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 cursor-pointer">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={s_user?.profilePicture} />
                  <AvatarFallback>
                    <UserRound size={20} />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white">
                    {s_user.username}
                    {s_user.role === "celebrity" && (
                      <span className="text-blue-500 ml-1 inline-block align-middle">
                        <BadgeCheck className="w-4 h-4" />
                      </span>
                    )}
                  </h1>
                  <p className="text-gray-700 dark:text-gray-400">
                    {s_user.bio || "My Profile Bio Here"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RightBar;
