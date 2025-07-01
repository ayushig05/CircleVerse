import React from "react";
import { useState } from "react";
import { KeySquareIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;
import LoadingButton from "@/components/common/loader";
import { handleAuthRequest } from "@/utils/api";
import { useNavigate } from "react-router-dom";

const Forget_password = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.success("Please enter your email");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.success("Please enter a valid email address");
      return;
    }
    const forgetPassReq = async () => {
      return await axios.post(
        `${API_URL}/users/forget-password`,
        { email },
        { withCredentials: true }
      );
    };
    const result = await handleAuthRequest(forgetPassReq, setIsLoading);
    if (result) {
      toast.success(result.data.message);
      navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full h-screen">
      <KeySquareIcon className="w-20 h-20 sm:w-32 sm:h-32 text-red-600 mb-12" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">
        Forget Your Password?
      </h1>
      <p className="mb-6 text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 font-medium">
        Enter your email and we will help you to reset your password
      </p>
      <input
        type="email"
        placeholder="Enter your email"
        className="px-6 py-3.5 rounded-lg outline-none block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto bg-muted dark:bg-muted text-foreground dark:text-foreground border border-border focus:ring-2 focus:ring-ring"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <LoadingButton
        size={"lg"}
        className="w-40 mt-4 cursor-pointer"
        isLoading={isLoading}
        onClick={handleSubmit}
      >
        Continue
      </LoadingButton>
    </div>
  );
};

export default Forget_password;
