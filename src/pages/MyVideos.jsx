
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyVideos() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logged-in user's videos
  const getMyVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/videos/my-videos`,
        {
          withCredentials: true,
        }
      );

      setVideos(response.data.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load your videos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyVideos();
  }, []);

  // Delete video
  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API}/videos/${videoId}`,
        {
          withCredentials: true,
        }
      );

      setVideos((prevVideos) =>
        prevVideos.filter(
          (video) => video._id !== videoId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete video"
      );
    }
  };

  // Publish / Unpublish
  const handleTogglePublish = async (videoId) => {
    try {
      await axios.patch(
        `${API}/videos/${videoId}/toggle/publish`,
        {},
        {
          withCredentials: true,
        }
      );

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? {
                ...video,
                isPublished: !video.isPublished,
              }
            : video
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update video status"
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-9 w-48 bg-slate-200 rounded-lg animate-pulse" />

          <div className="mt-8 space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 bg-white border border-[#E2E8F0] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              My Videos
            </h1>

            <p className="mt-2 text-[#64748B]">
              Manage the videos you've uploaded to MyTube.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="
              inline-flex items-center justify-center gap-2
              px-5 py-3 rounded-xl
              bg-[#2563EB] text-white
              font-semibold
              shadow-sm
              hover:bg-[#1D4ED8]
              hover:shadow-md
              transition-all duration-200
            "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v14m-7-7h14"
              />
            </svg>

            Upload Video
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 text-xl font-bold"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Empty State */}
        {videos.length === 0 && !error && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-10 sm:p-14 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 10l4.5-2.5A1 1 0 0 1 21 8.37v7.26a1 1 0 0 1-1.5.87L15 14m-10 5h7a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[#0F172A]">
              No videos yet
            </h2>

            <p className="mt-2 text-[#64748B]">
              Upload your first video and share it with the
              MyTube community.
            </p>

            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="
                mt-6 px-5 py-2.5 rounded-xl
                bg-[#2563EB] text-white
                font-semibold
                hover:bg-[#1D4ED8]
                transition
              "
            >
              Upload Your First Video
            </button>
          </div>
        )}

        {/* Videos */}
        <div className="space-y-5">
          {videos.map((video) => (
            <article
              key={video._id}
              className="
                bg-white
                border border-[#E2E8F0]
                rounded-2xl
                p-4 sm:p-5
                shadow-sm
                hover:shadow-md
                hover:border-blue-200
                transition-all duration-200
              "
            >
              <div className="flex flex-col md:flex-row gap-5">

                {/* Thumbnail */}
                <div
                  onClick={() =>
                    video.isPublished &&
                    navigate(`/watch/${video._id}`)
                  }
                  className={`
                    relative w-full md:w-64 lg:w-72
                    aspect-video md:h-40
                    shrink-0 overflow-hidden
                    rounded-xl bg-slate-100
                    ${
                      video.isPublished
                        ? "cursor-pointer group"
                        : ""
                    }
                  `}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title || "Video thumbnail"}
                    className={`
                      w-full h-full object-cover
                      ${
                        video.isPublished
                          ? "group-hover:scale-[1.03]"
                          : ""
                      }
                      transition-transform duration-300
                    `}
                  />

                  {/* Unpublished overlay */}
                  {!video.isPublished && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 text-[#334155] text-xs font-bold">
                        Unpublished
                      </span>
                    </div>
                  )}

                  {/* Play */}
                  {video.isPublished && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-11 h-11 rounded-full bg-white/95 shadow-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-[#2563EB] ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7L8 5Z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Information */}
                <div className="flex-1 min-w-0 flex flex-col">

                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A] line-clamp-2">
                      {video.title || "Untitled video"}
                    </h2>

                    <p className="mt-2 text-sm text-[#64748B] line-clamp-3">
                      {video.description ||
                        "No description available."}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mt-4">
                    <span
                      className={`
                        inline-flex items-center gap-2
                        px-3 py-1.5 rounded-full
                        text-xs font-bold
                        ${
                          video.isPublished
                            ? "bg-blue-50 text-[#2563EB]"
                            : "bg-slate-100 text-[#64748B]"
                        }
                      `}
                    >
                      <span
                        className={`
                          w-1.5 h-1.5 rounded-full
                          ${
                            video.isPublished
                              ? "bg-[#2563EB]"
                              : "bg-[#94A3B8]"
                          }
                        `}
                      />

                      {video.isPublished
                        ? "Published"
                        : "Unpublished"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-5">

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/edit-video/${video._id}`
                        )
                      }
                      className="
                        px-4 py-2.5 rounded-xl
                        border border-[#CBD5E1]
                        text-[#334155]
                        font-semibold text-sm
                        hover:bg-slate-50
                        hover:border-blue-200
                        hover:text-[#2563EB]
                        transition
                      "
                    >
                      Edit
                    </button>

                    {/* Publish / Unpublish */}
                    <button
                      type="button"
                      onClick={() =>
                        handleTogglePublish(video._id)
                      }
                      className="
                        px-4 py-2.5 rounded-xl
                        bg-blue-50
                        text-[#2563EB]
                        font-semibold text-sm
                        hover:bg-blue-100
                        transition
                      "
                    >
                      {video.isPublished
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(video._id)
                      }
                      className="
                        px-4 py-2.5 rounded-xl
                        border border-red-200
                        text-red-500
                        font-semibold text-sm
                        hover:bg-red-50
                        transition
                      "
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}