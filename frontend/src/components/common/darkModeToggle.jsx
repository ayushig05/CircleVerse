import React from "react";
import { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { setAuthUser } from "@/store/authSlice";

const DarkModeToggle = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isDark, setIsDark] = useState(user?.darkMode ?? false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (user?._id) {
      axios
        .post(
          `${API_URL}/users/update-theme`,
          { darkMode: isDark },
          { withCredentials: true }
        )
        .then((res) => {
          dispatch(setAuthUser(res.data.data.user));
        })
        .catch((err) => console.error(err));
    }
  }, [isDark]);

  return (
    <div
      onClick={() => setIsDark((prev) => !prev)}
      className="flex items-center justify-between cursor-pointer p-4 rounded-md transition w-full"
    >
      <span className="text-lg font-medium">Enable Dark Mode</span>
      {isDark ? (
        <ToggleRight className="text-blue-600" />
      ) : (
        <ToggleLeft className="text-gray-600" />
      )}
    </div>
  );
};

export default DarkModeToggle;
