import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { handleAuthRequest } from "@/utils/api";
import { setAuthUser } from "@/store/authSlice";
import Image from "../../assets/logo1.jpg";
import Password from "@/components/common/password";
import LoadingButton from "@/components/common/loader";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.success("Email and password are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.success("Please enter a valid email address");
      return;
    }
    const loginReq = async () => {
      return await axios.post(`${API_URL}/users/login`, formData, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(loginReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      navigate("/");
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-4 hidden lg:block h-screen w-full">
          <img
            src={Image}
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
          <h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-8">
            Log In with <span className="text-rose-600">CircleVerse</span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="black w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]"
          >
            <div className="mb-4">
              <label htmlFor="email" className="font-semibold mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="px-4 py-3 rounded-lg w-full block outline-none bg-muted dark:bg-muted text-foreground dark:text-foreground border border-border focus:ring-2 focus:ring-ring"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <Password
                label="Password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />
              <Link
                to="/auth/forget-password"
                className="mt-2 text-red-600 block font-semibold text-base cursor-pointer text-right"
              >
                Forget Password?
              </Link>
            </div>
            <LoadingButton
              size={"lg"}
              className="w-full mt-3 bg-black text-white dark:bg-white dark:text-black cursor-pointer"
              type="submit"
              isLoading={isLoading}
            >
              Log In
            </LoadingButton>
          </form>
          <h1 className="mt-4 text-lg text-gray-800 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/auth/signup">
              <span className="text-blue-800 dark:text-blue-400 underline font-medium">
                SignUp Here
              </span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
