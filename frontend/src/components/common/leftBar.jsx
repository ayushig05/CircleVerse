import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;
import {
  Heart,
  HomeIcon,
  LogOut,
  MessageCircle,
  Search,
  SquarePlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "../../assets/logo.jpg";
import { setAuthUser } from "@/store/authSlice";
import CreatePost from "./createPost";

const LeftBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
    dispatch(setAuthUser(null));
    toast.success("Logout Successfully");
    navigate("/auth/login");
  };

  const handleSidebar = (label) => {
    if (label === "Home") {
      navigate("/");
    }
    if (label === "Logout") {
      handleLogout();
    }
    if (label === "Profile") {
      navigate(`/profile/${user?._id}`);
    }
    if (label === "Create") {
      setIsDialogOpen(true);
    }
  };

  const SideBarLinks = [
    {
      icon: <HomeIcon />,
      label: "Home",
    },
    {
      icon: <Search />,
      label: "Search",
    },
    {
      icon: <MessageCircle />,
      label: "Message",
    },
    {
      icon: <Heart />,
      label: "Notification",
    },
    {
      icon: <SquarePlus />,
      label: "Create",
    },
    {
      icon: (
        <Avatar className="w-9 h-9">
          <AvatarImage src={user?.profilePicture} className="w-full h-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      label: "Profile",
    },
    {
      icon: <LogOut />,
      label: "Logout",
    },
  ];

  return (
    <div className="h-full mt-12">
      <CreatePost
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      <div className="lg:p-6 p-3 cursor-pointer">
        <div
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            src={Image}
            alt="logo"
            width={100}
            height={100}
            className="mt-[-2rem]"
          />
        </div>
        <div className="mt-6">
          {SideBarLinks.map((link) => {
            return (
              <div
                key={link.label}
                className="flex items-center mb-2 p-3 rounded-lg group cursor-pointer transition-all duration-200 hover:bg-gray-100 space-x-2"
                onClick={() => handleSidebar(link.label)}
              >
                <div className="group-hover:scale-110 transition-all duration-200">
                  {link.icon}
                </div>
                <p className="lg:text-lg text-base">{link.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
