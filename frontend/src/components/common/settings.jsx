import React from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MenuIcon, LogOut, Trash2 } from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_API;
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { setAuthUser } from "../../store/authSlice";
import LeftBar from "./leftBar";
import DeleteProfile from "./deleteProfile";
import DarkModeToggle from "./darkModeToggle";
import ChangePasswordDialog from "./changePassword";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleLogout = async () => {
    await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
    dispatch(setAuthUser(null));
    toast.success("Logout Successfully");
    navigate("/auth/login");
  };

  return (
    <div className="flex mb-20">
      <div className="w-[16%] hidden md:block border-r-2 h-screen fixed">
        <LeftBar />
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="m-4" />
          </SheetTrigger>
          <SheetContent>
            <SheetTitle></SheetTitle>
            <SheetDescription>
              <LeftBar />
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1 md:ml-[20%] w-[90%] sm:w-[80%] mx-auto overflow-y-auto">
        <div className="mt-8 pb-8 border-b-2">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Manage your preferences and account settings.
          </p>
        </div>
        <div className="mt-10 space-y-6 max-w-xl">
          <DarkModeToggle />
          <div
            onClick={() => setIsPasswordDialogOpen(true)}
            className="flex items-center space-x-4 cursor-pointer p-4 rounded-md transition"
          >
            <span className="text-lg font-medium">Change Password</span>
          </div>
          <ChangePasswordDialog
            isOpen={isPasswordDialogOpen}
            onClose={() => setIsPasswordDialogOpen(false)}
          />
          <div
            onClick={handleLogout}
            className="flex items-center space-x-4 cursor-pointer p-4 rounded-md transition"
          >
            <span className="text-lg font-medium">Logout</span>
            <LogOut className="text-gray-700 dark:text-white" />
          </div>
          <div
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center space-x-4 cursor-pointer p-4 rounded-md text-red-600 dark:text-red-300 transition"
          >
            <span className="text-lg font-medium">Delete Account</span>
            <Trash2 />
          </div>
          <DeleteProfile
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
