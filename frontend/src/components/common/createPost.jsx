import React from "react";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ImageIcon, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_API;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import LoadingButton from "./loader";
import { handleAuthRequest } from "@/utils/api";
import { addPosts } from "@/store/postSlice";
import MediaCarousel from "./mediaCarousel";

const CreatePost = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState([]);
  const [previewURL, setPreviewURL] = useState([]);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile([]);
      setPreviewURL([]);
      setCaption("");
    }
  }, [isOpen]);

  const handleButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) {
      return;
    }
    const validFiles = [];
    const previews = [];
    for (let file of files) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) {
        toast.success("Only image and video files are supported.");
        return;
      }
      if (file.size > 30 * 1024 * 1024) {
        toast.success("File size should not exceed 30MB.");
        return;
      }
      validFiles.push(file);
      previews.push({
        url: URL.createObjectURL(file),
        type: isImage ? "image" : "video",
      });
    }
    setSelectedFile(validFiles);
    setPreviewURL(previews);
  };

  const handleCreatePost = async () => {
    if (!selectedFile || selectedFile.length === 0) {
      toast.success("Please select at least one file to create a post.");
      return;
    }
    const formData = new FormData();
    formData.append("caption", caption);
    selectedFile.forEach((file) => formData.append("media", file));
    const createPostReq = async () => {
      return await axios.post(`${API_URL}/posts/create-post`, formData, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(createPostReq, setIsLoading);
    if (result) {
      dispatch(addPosts(result.data.data.post));
      toast.success("Post Created Successfully");
      setTimeout(() => {
        setSelectedFile([]);
        setPreviewURL([]);
        setCaption("");
        onClose();
        navigate("/");
        window.location.reload();
      }, 1000);
    }
  };

  const handleGenerateCaption = async () => {
    if (!selectedFile) {
      toast.error("Please upload media first.");
      return;
    }
    const filename = selectedFile?.[0]?.name;
    try {
      const res = await axios.post(`${API_URL}/posts/generate-caption`, {
        description: filename,
      });
      if (res.data?.data?.caption) {
        setCaption(res.data.data.caption);
        toast.success("AI caption generated!");
      } else {
        toast.error("Failed to generate caption");
      }
    } catch (error) {
      toast.error("Error generating caption");
      console.error("Caption error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-w-md w-full dark:bg-zinc-900 bg-white text-foreground dark:text-white">
        {previewURL.length > 0 ? (
          <div className="flex flex-col items-center text-center justify-center space-y-4">
            <MediaCarousel media={previewURL} />
            <div className="flex flex-col sm:flex-row w-full gap-4 items-center mt-4">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="p-2 border rounded-md w-full sm:w-[78%] bg-muted dark:bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Button
                disabled={isLoading}
                className="w-full sm:w-[22%] bg-purple-600 text-white text-xs hover:bg-purple-700 cursor-pointer"
                onClick={handleGenerateCaption}
              >
                Generate with AI
              </Button>
            </div>
            <div className="flex space-x-4 mt-4">
              <LoadingButton
                className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                onClick={handleCreatePost}
                isLoading={isLoading}
              >
                Create Post
              </LoadingButton>
              <Button
                className="bg-gray-500 text-white hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  setPreviewURL([]);
                  setSelectedFile([]);
                  setCaption("");
                  onClose();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle className="text-center mt-3 mb-3">
                Upload Photo or Video
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex space-x-2 text-gray-600 dark:text-gray-300 mt-4">
                <ImageIcon size={40} />
                <VideoIcon size={40} />
              </div>
              <p className="text-gray-600">Upload a photo or video</p>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                onClick={handleButton}
              >
                Upload
              </Button>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
