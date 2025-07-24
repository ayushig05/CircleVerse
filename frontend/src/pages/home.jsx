import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader, MenuIcon } from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_API;
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { handleAuthRequest } from "@/utils/api";
import { setAuthUser } from "@/store/authSlice";
import LeftBar from "../components/common/leftBar";
import Feed from "../components/common/feed";
import RightBar from "../components/common/rightBar";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthUser = async () => {
      const getAuthUserReq = async () => {
        return await axios.get(`${API_URL}/users/me`, {
          withCredentials: true,
        });
      };
      const result = await handleAuthRequest(getAuthUserReq, setIsLoading);
      if (result) {
        dispatch(setAuthUser(result.data.data.user));
        const theme = result.data.data.user.darkMode ? "dark" : "light";
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
      }
    };
    getAuthUser();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex">
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
        {/* <div className="border-2 -mb-12">Stories</div> */}
        <Feed />
      </div>
      <div className="w-[23%] px-6 lg:block hidden h-screen">
        <div className="flex flex-col">
          <div className="-mt-5">
            <RightBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
