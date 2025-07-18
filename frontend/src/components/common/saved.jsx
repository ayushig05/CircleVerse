import React from "react";
import { useParams } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

const Saved = ({ userProfile }) => {
  const { id } = useParams();

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {userProfile?.savedPosts?.length === 0 && (
        <p className="text-center text-gray-500 col-span-full">
          No saved posts yet.
        </p>
      )}
      {userProfile?.savedPosts?.map((post) => {
        if (typeof post === "string") {
          return null;
        }
        return (
          <div key={post._id} className="relative group overflow-hidden">
            {post?.video?.url ? (
              <video
                src={post.video.url}
                className="w-full h-full object-cover aspect-square"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate nofullscreen"
              />
            ) : (
              <img
                src={post?.image?.url}
                alt="Post"
                className="w-full h-full object-cover aspect-square"
              />
            )}

            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-70 transition-opacity duration-300">
              <div className="flex space-x-6">
                <button className="p-2 rounded-full text-white space-x-2 flex items-center font-bold">
                  <Heart className="w-7 h-7" />
                  <span>{post?.likes.length}</span>
                </button>
                <button className="p-2 rounded-full text-white space-x-2 flex items-center font-bold">
                  <MessageCircle className="w-7 h-7" />
                  <span>{post?.comments.length}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Saved;
