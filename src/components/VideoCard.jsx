
import React from "react";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  const ownerName =
    video?.owner?.fullname ||
    video?.owner?.username ||
    video?.owner?.userName ||
    "Unknown creator";

  return (
    <article
      onClick={() => navigate(`/watch/${video._id}`)}
      className="
        w-full
        cursor-pointer
        group
      "
    >
      {/* =========================
          THUMBNAIL
      ========================= */}

      <div
        className="
          relative
          w-full
          aspect-video
          overflow-hidden
          rounded-xl
          bg-gray-200
        "
      >
        <img
          src={video.thumbnail}
          alt={video.title || "Video thumbnail"}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-[1.03]
          "
          loading="lazy"
        />

        {/* Hover Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-black/0
            group-hover:bg-black/10
            transition-colors
            duration-300
          "
        />

        {/* Play Button */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-200
          "
        >
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-white/95
              shadow-lg
              flex
              items-center
              justify-center
            "
          >
            <svg
              className="w-5 h-5 ml-0.5 text-[#2563EB]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7L8 5Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* =========================
          VIDEO INFORMATION
      ========================= */}

      <div className="flex gap-3 mt-3">

        {/* Creator Avatar */}

        <div
          className="
            w-9
            h-9
            shrink-0
            rounded-full
            bg-blue-50
            text-[#2563EB]
            flex
            items-center
            justify-center
            font-semibold
            text-sm
          "
        >
          {ownerName.charAt(0).toUpperCase()}
        </div>

        {/* Text */}

        <div className="min-w-0 flex-1">

          <h2
            className="
              text-sm
              sm:text-base
              font-semibold
              text-gray-900
              leading-5
              line-clamp-2
              group-hover:text-[#2563EB]
              transition-colors
            "
          >
            {video.title || "Untitled video"}
          </h2>

          <p className="mt-1.5 text-sm text-gray-500 truncate">
            {ownerName}
          </p>

          <p className="mt-0.5 text-xs sm:text-sm text-gray-400">
            {video.views || 0} views
          </p>

        </div>
      </div>
    </article>
  );
}
