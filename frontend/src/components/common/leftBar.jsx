import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BadgeCheck,
  Heart,
  HomeIcon,
  MessageCircle,
  Search,
  Settings,
  SquarePlus,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "../../assets/logo.jpg";
import CreatePost from "./createPost";

const LeftBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSidebar = (label) => {
    if (label === "Home") {
      navigate("/");
    }
    if (label === "Create") {
      setIsDialogOpen(true);
    }
    if (label === "Settings") {
      navigate("/settings");
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
    ...(user?.role === "celebrity"
      ? [
          {
            icon: <SquarePlus />,
            label: "Create",
          },
        ]
      : []),
    {
      icon: <Settings />,
      label: "Settings",
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col">
      <CreatePost
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      <div className="flex justify-center py-3 px-4 mt-5">
        <h1 className="text-xl lg:text-2xl font-bold tracking-wide font-[Poppins] text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-indigo-500">
          Circle<span className="text-red">Verse</span>
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 space-y-2 pb-4">
        {SideBarLinks.map((link) => (
          <div
            key={link.label}
            className="flex items-center p-3 rounded-lg hover:bg-white/10 transition cursor-pointer space-x-3"
            onClick={() => handleSidebar(link.label)}
          >
            <div className="text-xl">{link.icon}</div>
            <p className="text-base lg:text-lg">{link.label}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-4">
        <div
          onClick={() => navigate(`/profile/${user?._id}`)}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
              {user?.username}
              {user?.role === "celebrity" && (
                <BadgeCheck className="w-4 h-4 text-blue-500" />
              )}
            </h1>
            <p className="text-gray-700 dark:text-gray-400">
              {user?.bio || "My Profile Bio Here"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
