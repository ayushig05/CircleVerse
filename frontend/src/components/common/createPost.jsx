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

const CreatePost = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [caption, setCaption] = useState("");
  const [fileType, setFileType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewURL(null);
      setCaption("");
      setFileType("");
    }
  }, [isOpen]);

  const handleButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      toast.error("Only image and video files are supported.");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      toast.error("File size should not exceed 30MB.");
      return;
    }
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setFileType(isImage ? "image" : "video");
  };

  const handleCreatePost = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to create a post.");
      return;
    }
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append(fileType, selectedFile);
    const endpoint = (fileType === "image") ? "/posts/create-post" : "/posts/create-video-post";
    const createPostReq = async () => {
      return await axios.post(`${API_URL}${endpoint}`, formData, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(createPostReq, setIsLoading);
    if (result) {
      dispatch(addPosts(result.data.data.post));
      toast.success("Post Created Successfully");
      setPreviewURL(null);
      setCaption("");
      setSelectedFile(null);
      onClose();
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {previewURL ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="mt-4">
              {fileType === "image" ? (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="overflow-auto max-h-96 rounded-md object-contain w-full"
                />
              ) : (
                <video
                  src={previewURL}
                  controls
                  className="overflow-auto max-h-96 rounded-md object-contain w-full"
                />
              )}
            </div>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="mt-4 p-2 border rounded-md w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
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
                  setPreviewURL(null);
                  setSelectedFile(null);
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
              <div className="flex space-x-2 text-gray-600 mt-4">
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
