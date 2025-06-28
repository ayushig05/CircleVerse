import { setAuthUser } from "@/store/authSlice";
import { handleAuthRequest } from "@/utils/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_BACKEND_API;

export const useFollowUnfollow = () => {
  const dispatch = useDispatch();

  const handleFollowUnfollow = async (userId) => {
    const followUnfollowReq = async () => {
      return await axios.post(
        `${API_URL}/users/follow-unfollow/${userId}`,
        {},
        { withCredentials: true }
      );
    };
    const result = await handleAuthRequest(followUnfollowReq);
    if (result?.data.status === "success") {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message, {
        className: "text-black",
      });
    }
  };
  return { handleFollowUnfollow };
};
