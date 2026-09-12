
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const API = import.meta.env.VITE_API_URL;

  // =========================
  // GET ALL VIDEOS
  // =========================

  const getVideos = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/videos`, {
        withCredentials: true,
      });

      setVideos(response.data?.data || []);
    } catch (error) {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH VIDEOS
  // =========================

  const searchVideos = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/videos/search`, {
        params: {
          query: searchQuery.trim(),
        },
        withCredentials: true,
      });

      setVideos(response.data?.data || []);
    } catch (error) {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD VIDEOS
  // =========================

  useEffect(() => {
    if (searchQuery.trim()) {
      searchVideos();
    } else {
      getVideos();
    }
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <section className="mb-7">

        {searchQuery.trim() ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full bg-[#2563EB]" />

              <p className="text-sm font-semibold text-[#2563EB]">
                Search results
              </p>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              "{searchQuery}"
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Latest Videos
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              Discover videos from the MyTube community
            </p>
          </>
        )}

      </section>

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">

          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="animate-pulse"
            >

              {/* Thumbnail */}

              <div className="aspect-video rounded-xl bg-gray-200" />

              {/* Video information */}

              <div className="flex gap-3 mt-3">

                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />

                <div className="flex-1 space-y-2">

                  <div className="h-4 bg-gray-200 rounded-md w-11/12" />

                  <div className="h-3 bg-gray-200 rounded-md w-7/12" />

                  <div className="h-3 bg-gray-200 rounded-md w-5/12" />

                </div>

              </div>

            </div>
          ))}

        </div>

      ) : videos.length === 0 ? (

        /* =========================
            EMPTY STATE
        ========================= */

        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center">

          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">

            <svg
              className="w-9 h-9 text-[#2563EB]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 19h8a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>

          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            {searchQuery.trim()
              ? "No videos found"
              : "No videos available"}
          </h2>

          <p className="mt-2 text-sm text-gray-500 max-w-sm px-4">
            {searchQuery.trim()
              ? `We couldn't find any videos matching "${searchQuery}".`
              : "There are no published videos to show right now."}
          </p>

          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => {
                window.history.replaceState({}, "", "/");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="
                mt-5
                px-5
                py-2.5
                rounded-full
                bg-[#2563EB]
                text-white
                text-sm
                font-semibold
                hover:bg-[#1D4ED8]
                active:scale-95
                transition
              "
            >
              Clear search
            </button>
          )}

        </div>

      ) : (

        /* =========================
            VIDEO GRID
        ========================= */

        <section
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-x-5
            gap-y-8
          "
        >

          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
            />
          ))}

        </section>

      )}

    </main>
  );
};

export default Home;
