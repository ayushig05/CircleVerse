import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserRound, BadgeCheck } from "lucide-react";
import { handleAuthRequest } from "@/utils/api";

const SearchUsers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("search");
  const type = searchParams.get("type");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!keyword || type !== "users") {
      return;
    }
    const fetchUsers = async () => {
      const fetchUsersReq = async () => {
        return await axios.get(
          `${API_URL}/users/search-user?keyword=${encodeURIComponent(keyword)}`,
          { withCredentials: true }
        );
      };
      const result = await handleAuthRequest(fetchUsersReq, setIsLoading);
      if (result) {
        setUsers(result.data.data.users || []);
      } else {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [keyword, type]);

  if (!users.length) {
    return (
      <div className="mt-20 text-center text-2xl font-semibold text-gray-600 dark:text-gray-300">
        No users found
      </div>
    );
  }

  return (
    <div className="mt-20 w-full max-w-2xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Search Results
      </h1>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => navigate(`/profile/${user._id}`)}
          className="flex items-center space-x-4 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors mb-3"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              <UserRound size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
              {user?.username}
              {user?.role === "celebrity" && (
                <BadgeCheck className="w-4 h-4 text-blue-500" />
              )}
            </h1>
            <p className="text-gray-700 dark:text-gray-400 text-sm">
              {user?.bio || "My Profile Bio Here"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchUsers;
