
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET WATCH HISTORY
  // =========================
  const getHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/users/getWatchHistory`,
        {
          withCredentials: true,
        }
      );

      setHistory(response.data.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load watch history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  // =========================
  // CLEAR HISTORY
  // =========================
  const clearHistory = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your watch history?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await axios.delete(
        `${API}/users/clearWatchHistory`,
        {
          withCredentials: true,
        }
      );

      setHistory([]);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to clear watch history"
      );
    }
  };

  // =========================
  // OPEN VIDEO
  // =========================
  const handleVideoClick = (video) => {
    if (!video?._id) return;

    navigate(`/watch/${video._id}`);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin" />

          <p className="text-sm font-medium text-[#64748B]">
            Loading watch history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =========================
            HEADER
        ========================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Watch History
            </h1>

            <p className="text-[#64748B] mt-2">
              Videos you've watched recently.
            </p>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="
                w-fit
                px-5 py-2.5
                rounded-xl
                border border-[#CBD5E1]
                bg-white
                text-[#334155]
                font-semibold
                hover:bg-slate-50
                hover:border-slate-400
                transition-all
              "
            >
              Clear History
            </button>
          )}

        </div>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
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

        {/* =========================
            EMPTY STATE
        ========================= */}
        {history.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm p-12 sm:p-16 text-center">

            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
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
                  d="M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[#0F172A]">
              Your watch history is empty
            </h2>

            <p className="text-[#64748B] mt-2">
              Videos you watch will appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                mt-6
                px-5 py-2.5
                rounded-xl
                bg-[#2563EB]
                text-white
                font-semibold
                hover:bg-[#1D4ED8]
                shadow-sm hover:shadow-md
                transition-all
              "
            >
              Explore Videos
            </button>

          </div>
        ) : (

          /* =========================
             HISTORY LIST
          ========================= */
          <div className="space-y-4">

            {history.map((item) => {
              const video = item.video || item;

              if (!video || !video._id) {
                return null;
              }

              return (
                <article
                  key={item._id || video._id}
                  onClick={() => handleVideoClick(video)}
                  className="
                    group
                    bg-white
                    border border-[#E2E8F0]
                    rounded-2xl
                    p-3 sm:p-4
                    cursor-pointer
                    hover:border-blue-200
                    hover:shadow-md
                    transition-all duration-200
                  "
                >

                  <div className="flex flex-col sm:flex-row gap-4">

                    {/* =========================
                        THUMBNAIL
                    ========================= */}
                    <div className="
                      relative
                      w-full sm:w-64 md:w-72
                      flex-shrink-0
                      aspect-video sm:aspect-auto
                      sm:h-36
                      overflow-hidden
                      rounded-xl
                      bg-slate-100
                    ">

                      <img
                        src={video.thumbnail}
                        alt={video.title || "Video thumbnail"}
                        className="
                          w-full h-full
                          object-cover
                          group-hover:scale-[1.03]
                          transition-transform duration-300
                        "
                      />

                      {/* PLAY OVERLAY */}
                      <div className="
                        absolute inset-0
                        flex items-center justify-center
                        bg-black/0
                        group-hover:bg-black/10
                        transition
                      ">
                        <div className="
                          w-11 h-11
                          rounded-full
                          bg-white/95
                          shadow-lg
                          flex items-center justify-center
                          opacity-0
                          group-hover:opacity-100
                          transition
                        ">
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
                        VIDEO INFO
                    ========================= */}
                    <div className="flex-1 min-w-0 py-1">

                      <h2 className="
                        text-lg sm:text-xl
                        font-bold
                        text-[#0F172A]
                        leading-snug
                        line-clamp-2
                        group-hover:text-[#2563EB]
                        transition-colors
                      ">
                        {video.title || "Untitled video"}
                      </h2>

                      <p className="text-sm text-[#64748B] mt-2">
                        {video.views || 0} views
                      </p>

                      {video.description && (
                        <p className="
                          text-sm
                          text-[#64748B]
                          mt-3
                          line-clamp-2
                          leading-relaxed
                        ">
                          {video.description}
                        </p>
                      )}

                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                        Watch video
                      </div>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}
