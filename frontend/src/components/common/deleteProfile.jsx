import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { handleAuthRequest } from "@/utils/api";
import { setAuthUser } from "@/store/authSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import LoadingButton from "./loader";

const DeleteProfile = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const deleteReq = async () => {
      return await axios.delete(`${API_URL}/users/signout`, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(deleteReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(null));
      toast.success(result.data.message);
      navigate("/auth/login");
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center mt-3 mb-6 text-red-600">
              Delete Your Account?
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-600 mb-6 dark:text-gray-300">
            Are you sure you want to delete your account? This action is
            irreversible.
          </p>
          <div className="flex justify-center space-x-4">
            <LoadingButton
              isLoading={isLoading}
              className="bg-red-600 hover:bg-red-700 cursor-pointer text-white"
              onClick={handleDelete}
            >
              Delete
            </LoadingButton>
            <Button
              className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteProfile;
