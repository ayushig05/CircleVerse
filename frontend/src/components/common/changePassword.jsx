import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import { handleAuthRequest } from "@/utils/api";
import Password from "./password";
import LoadingButton from "./loader";

const ChangePasswordDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{8,}$/.test(
      password
    );

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return toast.error("Please fill in all password fields.");
    }
    if (newPassword !== newPasswordConfirm) {
      return toast.error("New passwords do not match.");
    }
    if (!isStrongPassword(newPassword)) {
      return toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, special character, and number."
      );
    }
    const data = { currentPassword, newPassword, newPasswordConfirm };
    const req = async () => {
      return await axios.post(`${API_URL}/users/change-password`, data, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(req, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      onClose();
    }
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Password
            name="currentPassword"
            value={currentPassword}
            label="Current Password"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Password
            name="newPassword"
            value={newPassword}
            label="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Password
            name="newPasswordConfirm"
            value={newPasswordConfirm}
            label="Confirm New Password"
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
          <div className="flex justify-end">
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              className="bg-blue-700"
            >
              Update Password
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
