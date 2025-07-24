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
    <div className="h-full mt-12 relative">
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
                className="flex items-center mb-2 p-3 rounded-lg group cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 space-x-2"
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
      <div className="absolute bottom-0 left-0 w-full px-4 py-14">
        <div
          onClick={() => navigate(`/profile/${user?._id}`)}
          className="flex items-center space-x-4 cursor-pointer rounded-md border-t-2 pt-3"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              <UserRound size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
              {user?.username}
              {user?.role === "celebrity" && (
                <span className="text-blue-500">
                  <BadgeCheck className="w-4 h-4" />
                </span>
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
