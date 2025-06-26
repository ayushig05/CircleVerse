import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { Loader } from "lucide-react";
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
        <div className="flex items-center space-x-4">
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold">{user?.username}</h1>
            <p className="text-gray-700">
              {user?.bio || "My Profile Bio Here"}
            </p>
          </div>
        </div>
        <h1 className="font-medium text-blue-700 cursor-pointer">Switch</h1>
      </div>
      <div className="flex items-center justify-between mt-8">
        <h1 className="font-semibold text-gray-700">Suggested User</h1>
        <h1 className="font-medium cursor-pointer">See All</h1>
      </div>
      {suggestedUser?.slice(0, 5).map((s_user) => {
        return (
          <div onClick={() => navigate(`/profile/${s_user._id}`)} key={s_user._id} className="mt-6 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 cursor-pointer">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={s_user?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-bold">{s_user.username}</h1>
                  <p className="text-gray-700">
                    {s_user.bio || "My Profile Bio Here"}
                  </p>
                </div>
              </div>
              <h1 className="font-medium text-blue-700 cursor-pointer">Details</h1>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RightBar;
