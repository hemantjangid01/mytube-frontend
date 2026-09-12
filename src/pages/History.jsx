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

            console.log("Watch history:", response.data);

            setHistory(response.data.data || []);
        } catch (error) {
            console.error(
                "History error:",
                error.response?.data || error.message
            );

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
            await axios.delete(
                `${API}/users/clearWatchHistory`,
                {
                    withCredentials: true,
                }
            );

            setHistory([]);
        } catch (error) {
            console.error(
                "Clear history error:",
                error.response?.data || error.message
            );

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">

                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

                    <p className="text-sm text-gray-500">
                        Loading watch history...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* =========================
                    HEADER
                ========================= */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Watch History
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Videos you've watched recently.
                        </p>
                    </div>

                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="w-fit px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition"
                        >
                            Clear History
                        </button>
                    )}

                </div>

                {/* =========================
                    ERROR
                ========================= */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3">

                        <p className="text-sm text-red-600">
                            {error}
                        </p>

                    </div>
                )}

                {/* =========================
                    EMPTY STATE
                ========================= */}
                {history.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">

                        <div className="text-5xl mb-5">
                            🕘
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">
                            Your watch history is empty
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Videos you watch will appear here.
                        </p>

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
                                    onClick={() =>
                                        handleVideoClick(video)
                                    }
                                    className="group bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200"
                                >

                                    <div className="flex flex-col sm:flex-row gap-4">

                                        {/* =========================
                                            THUMBNAIL
                                        ========================= */}
                                        <div className="relative w-full sm:w-64 md:w-72 flex-shrink-0 aspect-video sm:aspect-auto sm:h-36 overflow-hidden rounded-xl bg-gray-200">

                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />

                                            {/* PLAY OVERLAY */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition">

                                                <div className="w-12 h-12 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                    ▶
                                                </div>

                                            </div>

                                        </div>

                                        {/* =========================
                                            VIDEO INFO
                                        ========================= */}
                                        <div className="flex-1 min-w-0 py-1">

                                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition">
                                                {video.title}
                                            </h2>

                                            <p className="text-sm text-gray-500 mt-2">
                                                {video.views} views
                                            </p>

                                            {video.description && (
                                                <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                                                    {video.description}
                                                </p>
                                            )}

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