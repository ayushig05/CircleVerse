import { toast } from "sonner";

export const handleAuthRequest = async (requestCallback, setLoading) => {
    if (setLoading) {
      setLoading(true);
    }
    try {
        const response = await requestCallback();
        return response;
    } catch (error) {
        const axiosError = error;
        console.error(error);
        if (axiosError?.response && axiosError.response.data && axiosError.response.data.message) {
            toast.error(axiosError.response.data.message);
        } else {
            toast.error("Something went wrong. Please try again later.");
        }
        return null;
    } finally {
        if (setLoading) {
            setLoading(false);
        }
    }
};
