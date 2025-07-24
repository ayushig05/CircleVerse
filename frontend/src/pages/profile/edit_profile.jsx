import React from "react";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
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
import { handleAuthRequest } from "@/utils/api";
import { setAuthUser } from "@/store/authSlice";

const EditProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [selectedImage, setSelectedImage] = useState("");
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);

  const fileInputRef = useRef([]);

  useEffect(() => {
    if (!user) {
      toast.success("Please login to access this page.");
      navigate("/auth/login");
    } else if (id && user._id !== id) {
      toast.success("Unauthorized access.");
      navigate("/");
    } else {
      setSelectedImage(user?.profilePicture || "");
    }
  }, [user, id, navigate]);

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (username.trim()) {
      formData.append("username", username);
    } 
    if (bio.trim()) {
      formData.append("bio", bio);
    }
    if (email.trim()) {
      formData.append("email", email);
    }
    if (!username.trim() && !bio.trim() && !email.trim()) {
      return toast.error("No changes to update.");
    }
    const updateProfileReq = async () => {
      return await axios.post(`${API_URL}/users/edit-profile`, formData, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(updateProfileReq, setIsFormLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
    }
    setUsername("");
    setBio("");
    setEmail("");
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
        <form onSubmit={handleUpdateProfile} className="py-5">
          <div className="flex flex-col gap-4 px-4">
            <div className="flex items-center gap-6">
              <label htmlFor="username" className="w-24 text-lg font-bold">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username"
                className="w-[90%] sm:w-[60%] md:w-[50%] h-10 bg-muted dark:bg-muted text-foreground dark:text-foreground outline-none px-4 rounded-md"
              />
            </div>
            <div className="flex items-start gap-6">
              <label htmlFor="bio" className="w-24 text-lg font-bold pt-2">
                Bio
              </label>
              <input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter your bio"
                className="w-[90%] sm:w-[60%] md:w-[50%] h-10 bg-muted dark:bg-muted text-foreground dark:text-foreground outline-none px-4 rounded-md resize-none"
              />
            </div>
            <div className="flex items-center gap-6">
              <label htmlFor="email" className="w-24 text-lg font-bold">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter new email"
                className="w-[90%] sm:w-[60%] md:w-[50%] h-10 bg-muted dark:bg-muted text-foreground dark:text-foreground outline-none px-4 rounded-md"
              />
            </div>
            <div className="ml-32 mt-4">
              <LoadingButton
                isLoading={isFormLoading}
                size={"lg"}
                className="cursor-pointer"
                type="submit"
              >
                Update Profile
              </LoadingButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
