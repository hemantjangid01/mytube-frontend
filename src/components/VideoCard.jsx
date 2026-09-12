import React from "react";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/watch/${video._id}`)}
      className="w-full cursor-pointer overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title || "Video thumbnail"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Video Info */}
      <div className="p-3">
        <h1 className="font-semibold text-gray-900 line-clamp-2">
          {video.title}
        </h1>

        <h3 className="text-sm text-gray-500 mt-2">
          {video.views || 0} views
        </h3>

        <h2 className="text-sm text-gray-600 mt-1">
          {video.owner?.username || video.owner?.userName}
        </h2>
      </div>
    </div>
  );
}