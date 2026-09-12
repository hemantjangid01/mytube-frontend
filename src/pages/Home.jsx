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

      console.log("VIDEOS:", response.data);

      setVideos(response.data.data || []);
    } catch (error) {
      console.error(
        "Get videos error:",
        error.response?.data || error.message
      );

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

      console.log("SEARCH RESULTS:", response.data);

      setVideos(response.data.data || []);
    } catch (error) {
      console.error(
        "Search error:",
        error.response?.data || error.message
      );

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
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">

      {/* =========================
          SEARCH HEADER
      ========================= */}

      {searchQuery.trim() ? (
        <div className="mb-7">
          <p className="text-sm font-medium text-gray-500 mb-1">
            Search results
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            "{searchQuery}"
          </h1>

          <div className="mt-3 h-px bg-gray-200" />
        </div>
      ) : (
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Latest Videos
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Discover videos from the community
          </p>
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="animate-pulse"
            >
              {/* Thumbnail */}
              <div className="aspect-video rounded-xl bg-gray-200" />

              {/* Text */}
              <div className="flex gap-3 mt-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-11/12" />
                  <div className="h-3 bg-gray-200 rounded w-7/12" />
                  <div className="h-3 bg-gray-200 rounded w-5/12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (

        /* =========================
            EMPTY STATE
        ========================= */

        <div className="flex flex-col items-center justify-center py-24 text-center">

          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <svg
              className="w-9 h-9 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 19h8a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            {searchQuery.trim()
              ? "No videos found"
              : "No videos available"}
          </h2>

          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            {searchQuery.trim()
              ? `We couldn't find any videos matching "${searchQuery}".`
              : "There are no published videos to show right now."}
          </p>
        </div>

      ) : (

        /* =========================
            VIDEO GRID
        ========================= */

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 ">

          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
            />
          ))}

        </div>
      )}
    </div>
  );
};

export default Home;