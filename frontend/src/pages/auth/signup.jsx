import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { handleAuthRequest } from "@/utils/api";
import Image from "../../assets/logo.jpg";
import Password from "@/components/common/password";
import LoadingButton from "@/components/common/loader";
import { setAuthUser } from "@/store/authSlice";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/.test(
      password
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      return toast.error("Please fill in all fields.");
    }
    if (!formData.role) {
      return toast.error("Please select the role.");
    }
    if (!["public", "celebrity"].includes(formData.role)) {
      return toast.error("Please select a valid role (Public or Celebrity).");
    }
    if (formData.password !== formData.passwordConfirm) {
      toast.success("Confirm Password do not match with Password");
      return;
    }
    if (!isStrongPassword(formData.password)) {
      return toast.success(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a special character, and a number."
      );
    }
    const signupReq = async () => {
      return await axios.post(`${API_URL}/users/signup`, formData, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(signupReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      navigate("/auth/verify");
    } else {
      toast.success("Please fill in all fields.");
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-4 h-screen hidden lg:block">
          <img
            src={Image}
            alt="signup"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
          <h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-2">
            Sign Up with <span className="text-rose-600">CircleVerse</span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="black w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]"
          >
            <div className="mb-2">
              <label className="font-semibold mb-2 block">Role</label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <label
                    htmlFor="public"
                    className="text-sm text-gray-800 dark:text-gray-200"
                  >
                    Public
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="celebrity" id="celebrity" />
                  <label
                    htmlFor="celebrity"
                    className="text-sm text-gray-800 dark:text-gray-200"
                  >
                    Celebrity
                  </label>
                </div>
              </RadioGroup>
              {formData.role === "public" && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  As a public user, you can follow celebrities, like posts, and
                  explore content.
                </p>
              )}
              {formData.role === "celebrity" && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  As a celebrity, you can create posts, gain followers, and
                  engage with the audience.
                </p>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="name" className="font-semibold mb-2 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="px-4 py-3 rounded-lg w-full block outline-none bg-muted dark:bg-muted text-foreground dark:text-foreground border border-border focus:ring-2 focus:ring-ring"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
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
            <div className="mb-2">
              <Password
                label="Password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <Password
                label="Password Confirm"
                name="passwordConfirm"
                placeholder="Enter Password Confirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </div>
            <LoadingButton
              size={"lg"}
              className="w-full mt-3 bg-black text-white dark:bg-white dark:text-black cursor-pointer"
              type="submit"
              isLoading={isLoading}
            >
              Sign Up
            </LoadingButton>
          </form>
          <h1 className="mt-4 text-lg text-gray-800 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/auth/login">
              <span className="text-blue-800 dark:text-blue-400 underline cursor-pointer font-medium">
                Login Here
              </span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Signup;
