import React from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_API;
import Password from "@/components/common/password";
import LoadingButton from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { handleAuthRequest } from "@/utils/api";
import { setAuthUser } from "@/store/authSlice";

const Reset_password = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!otp || !password || !passwordConfirm) {
      return;
    }
    const data = { email, otp, password, passwordConfirm };
    const resetPassReq = async () => {
      return await axios.post(`${API_URL}/users/reset-password`, data, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(resetPassReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      navigate("/auth/login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl sm:text-3xl  font-bold mb-3">
        Reset Your Password
      </h1>
      <p className="mb-6 text-sm sm:text-base text-center text-gray-600 font-medium">
        Enter your OTP and new password to reset your password
      </p>
      <input
        type="number"
        placeholder="Enter OTP"
        className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto px-6 py-3 bg-gray-300 rounded-lg no-spinner outline-none"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <div className="mb-4 mt-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <Password
          name="passsword"
          placeholder="Enter your password"
          inputClassName="px-6 py-3 bg-gray-300 rounded-lg outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <Password
          name="passswordConfirm"
          placeholder="Enter your confirm password"
          inputClassName="px-6 py-3 bg-gray-300 rounded-lg outline-none"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <LoadingButton
          onClick={handleSubmit}
          isLoading={isLoading}
          className="cursor-pointer"
        >
          Change Password
        </LoadingButton>
        <Link to="/auth/forget-password">
          <Button variant={"ghost"} className="cursor-pointer">
            Go Back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Reset_password;
