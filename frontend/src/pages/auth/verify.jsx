import React from "react";
import { useState, useRef, useEffect } from "react";
import { Loader, MailCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_API;
import LoadingButton from "@/components/common/loader";
import { handleAuthRequest } from "@/utils/api";
import { setAuthUser } from "@/store/authSlice";

const Verify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pageLoading, setPageLoading] = useState(true);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!user) {
        navigate("/auth/login", { replace: true });
    } else if (user && user.isVerified) {
        navigate("/", { replace: true });
    } else {
        setPageLoading(false);
    }
  }, [user, navigate]);

  const handleChange = (index, e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    if (value.length === 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !inputRefs.current[index]?.value &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    const verifyReq = async () => {
      return await axios.post(
        `${API_URL}/users/verify`,
        { otp: otpValue },
        { withCredentials: true }
      );
    };
    const result = await handleAuthRequest(verifyReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      navigate("/");
    }
  };

  const handleResendOtp = async () => {
    const resendOtpReq = async () => {
      return await axios.post(`${API_URL}/users/resend-otp`, null, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(resendOtpReq, setIsLoading);
    if (result) {
      toast.success(result.data.message);
    }
  };

  if (pageLoading) {
    return (
        <div className="h-screen flex justify-center items-center">
            <Loader className="w-20 h-20 animate-spin" />
        </div>
    )
  }

  return (
    <form className="h-screen flex items-center flex-col justify-center">
      <MailCheck className="w-20 h-20 sm:w-32 sm:h-32 text-red-600 mb-12" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">OTP Verification</h1>
      <p className="mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
        We have sent a code to {user?.email}
      </p>
      <div className="flex space-x-4">
        {[0, 1, 2, 3, 4, 5].map((index) => {
          return (
            <input
              type="number"
              key={index}
              maxLength={1}
              className="sm:w-20 sm:h-20 w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white text-lg sm:text-3xl font-bold outline-gray-500 text-center no-spinner placeholder-gray-500"
              value={otp[index] || ""}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onChange={(e) => handleChange(index, e)}
            />
          );
        })}
      </div>
      <div className="flex items-center mt-4 space-x-2">
        <h1 className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300">
          Didn't get the OTP code?{" "}
        </h1>
        <button
          onClick={handleResendOtp}
          className="text-sm sm:text-lg font-medium text-blue-900 underline cursor-pointer"
        >
          Resend Code
        </button>
      </div>
      <LoadingButton
        onClick={handleSubmit}
        size={"lg"}
        className="mt-6 w-52 cursor-pointer"
        isLoading={isLoading}
      >
        Verify
      </LoadingButton>
    </form>
  );
};

export default Verify;
