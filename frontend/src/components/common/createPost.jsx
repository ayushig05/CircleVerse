import React from "react";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ImageIcon } from "lucide-react";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setPreviewImage(null);
      setCaption("");
    }
  }, [isOpen]);

  const handleButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file!");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should not exceed 10MB!");
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to create a post!");
    }
    const formData = new FormData();
    formData.append("caption", caption);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    const createPostReq = async () => {
      return await axios.post(`${API_URL}/posts/create-post`, formData, {
        withCredentials: true,
      });
    };
    const result = await handleAuthRequest(createPostReq, setIsLoading);
    if (result) {
      dispatch(addPosts(result.data.data.post));
      toast.success("Post Created Successfully");
      setPreviewImage(null);
      setCaption("");
      setSelectedImage(null);
      onClose();
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {previewImage ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Image"
                width={400}
                height={400}
                className="overflow-auto max-h-96 rounded-md object-contain w-full"
              />
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
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleCreatePost}
                isLoading={isLoading}
              >
                Create Post
              </LoadingButton>
              <Button
                className="bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedImage(null);
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
                Upload Photo
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex space-x-2 text-gray-600 mt-4">
                <ImageIcon size={40} />
              </div>
              <p className="text-gray-600">Upload a photo</p>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleButton}
              >
                Upload
              </Button>
              <input
                type="file"
                accept="image/*"
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
