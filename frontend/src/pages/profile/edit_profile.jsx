import React from "react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
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
import { MenuIcon, UserRound } from "lucide-react";
import LeftBar from "@/components/common/leftBar";
import LoadingButton from "@/components/common/loader";
import Password from "@/components/common/password";
import { handleAuthRequest } from "@/utils/api";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";

const EditProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [bio, setBio] = useState(user?.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [selectedImage, setSelectedImage] = useState(
    user?.profilePicture || []
  );
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const fileInputRef = useRef([]);

  const handleAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return toast.error("Only JPG, PNG or WEBP images are allowed.");
      }
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File size should be under 2MB.");
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateBio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    const updateBioReq = async () => {
      return await axios.post(`${API_URL}/users/edit-profile`, formData, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(updateBioReq, setIsBioLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
    }
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (fileInputRef.current?.files?.[0]) {
      formData.append("profilePicture", fileInputRef.current?.files?.[0]);
    }
    const updatePhotoReq = async () => {
      return await axios.post(`${API_URL}/users/edit-profile`, formData, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(updatePhotoReq, setIsPhotoLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
    }
  };

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/.test(
      password
    );

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return toast.success("Please fill in all password fields.");
    }
    if (newPassword !== newPasswordConfirm) {
      return toast.success("New passwords do not match.");
    }
    if (!isStrongPassword(newPassword)) {
      return toast.error(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a special character, and a number."
      );
    }
    const data = {
      currentPassword,
      newPassword,
      newPasswordConfirm,
    };
    const updatePasswordReq = async () => {
      return await axios.post(`${API_URL}/users/change-password`, data, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(
      updatePasswordReq,
      setIsPasswordLoading
    );
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
    }
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

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
        <form onSubmit={handleUpdatePhoto} className="w-[80%] mx-auto">
          <div className="md:mt-16 pb-8 border-b-2">
            <div className="flex cursor-pointer">
              <Avatar onClick={handleAvatar} className="w-[8rem] h-[8rem]">
                <AvatarImage
                  src={selectedImage || ""}
                  className="w-full h-full rounded-full"
                />
                <AvatarFallback>
                  <UserRound size={70} />
                </AvatarFallback>
              </Avatar>
              <div className="ml-10 mt-9">
                <h1 className="text-2xl font-bold">{user?.username}</h1>
                <input
                  type="file"
                  accept="image/"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div className="flex items-center justify-center">
                  <LoadingButton
                    isLoading={isPhotoLoading}
                    size={"lg"}
                    className="bg-blue-800 mt-4 cursor-pointer"
                    type="submit"
                  >
                    Change Photo
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
        </form>
        <form onSubmit={handleUpdateBio} className="border-b-2 py-5">
          <div className="flex flex-col sm:flex-row items- justify-center gap-4 sm:gap-10">
            <label htmlFor="bio" className="block text-lg font-bold">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-[90%] sm:w-[60%] md:w-[50%] h-14 bg-muted dark:bg-muted text-foreground dark:text-foreground outline-none p-4 rounded-md"
            ></textarea>
            <div className="flex justify-center sm:justify-end">
              <LoadingButton
                isLoading={isBioLoading}
                size={"lg"}
                className="cursor-pointer"
                type="submit"
              >
                Change Bio
              </LoadingButton>
            </div>
          </div>
        </form>
        <div className="flex flex-col justify-center sm:block">
          <h1 className="text-2xl font-bold text-foreground dark:text-foreground mt-6 text-center sm:text-left">
            Change Password
          </h1>
          <form className="mt-8 mb-8 ml-2" onSubmit={handlePasswordChange}>
            <div className="w-[90%] sm:w-[45%] md:w-[40%] lg:w-[30%] mx-auto sm:mx-0">
              <Password
                name="currentPassword"
                value={currentPassword}
                label="Current Password"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="w-[90%] sm:w-[45%] md:w-[40%] lg:w-[30%] mx-auto sm:mx-0 mt-4 mb-4">
              <Password
                name="newPassword"
                value={newPassword}
                label="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="w-[90%] sm:w-[45%] md:w-[40%] lg:w-[30%] mx-auto sm:mx-0">
              <Password
                name="newPasswordConfirm"
                value={newPasswordConfirm}
                label="New Password Confirm"
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-center sm:justify-start">
              <LoadingButton
                isLoading={isPasswordLoading}
                type="submit"
                className="bg-red-700 cursor-pointer"
              >
                Change Password
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
