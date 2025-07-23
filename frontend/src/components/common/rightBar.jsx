import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { Loader, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { handleAuthRequest } from "@/utils/api";
import { setAuthUser } from "@/store/authSlice";

const RightBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const handleLogout = async () => {
    await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
    dispatch(setAuthUser(null));
    toast.success("Logout Successfully");
    navigate("/auth/login");
  };

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
        <h1
          onClick={handleLogout}
          className="font-medium text-red-600 dark:text-red-400 cursor-pointer hover:underline"
        >
          Logout
        </h1>
      </div>
      <div className="flex items-center justify-between mt-8">
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
                      <span className="text-xs text-blue-600 ml-1">
                        (celebrity)
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
