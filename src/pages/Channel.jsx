import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Channel() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);

    const [activeTab, setActiveTab] = useState("home");

    const [loading, setLoading] = useState(true);
    const [videosLoading, setVideosLoading] = useState(false);

    const [error, setError] = useState("");
    const [videosError, setVideosError] = useState("");

    const API = import.meta.env.VITE_API_URL;
    const getChannel = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API}/users/${username}`,
                {
                    withCredentials: true,
                }
            );

            setChannel(response.data.data);
        } catch (error) {
            console.error(
                "Channel error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load channel"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // GET CHANNEL VIDEOS
    // =========================
    const getChannelVideos = async () => {
        try {
            setVideosLoading(true);
            setVideosError("");

            const response = await axios.get(
               `${API}/videos/channel/${username}`,
                {
                    withCredentials: true,
                }
            );

            setVideos(response.data.data || []);
        } catch (error) {
            console.error(
                "Channel videos error:",
                error.response?.data || error.message
            );

            setVideosError(
                error.response?.data?.message ||
                "Failed to load channel videos"
            );
        } finally {
            setVideosLoading(false);
        }
    };

    // =========================
    // INITIAL CHANNEL LOAD
    // =========================
    useEffect(() => {
        getChannel();
    }, [username]);

    // =========================
    // LOAD VIDEOS WHEN TAB OPENS
    // =========================
    useEffect(() => {
        if (activeTab === "videos") {
            getChannelVideos();
        }
    }, [activeTab, username]);

    // =========================
    // SUBSCRIBE / UNSUBSCRIBE
    // =========================
    const handleSubscribe = async () => {
        try {
            await axios.post(
                `${API}/subscriptions/toggleSubscription/${channel._id}`,
                {},
                {
                    withCredentials: true,
                }
            );

            await getChannel();
        } catch (error) {
            console.log(
                "Subscription error:",
                error.response?.data || error.message
            );
        }
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
                        Loading channel...
                    </p>

                </div>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm max-w-md w-full">

                    <h2 className="text-xl font-bold text-gray-900">
                        Something went wrong
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {error}
                    </p>

                    <button
                        onClick={getChannel}
                        className="mt-6 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    // =========================
    // CHANNEL NOT FOUND
    // =========================
    if (!channel) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-2xl font-bold text-gray-900">
                        Channel not found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        This channel doesn't exist.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* =========================
                COVER IMAGE
            ========================= */}
            <div className="w-full">

                <div className="relative w-full h-52 sm:h-64 md:h-72 bg-gray-200 overflow-hidden">

                    {channel.coverImage ? (
                        <img
                            src={channel.coverimage}
                            alt="Channel cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                    )}

                    <div className="absolute inset-0 bg-black/10"></div>

                </div>

            </div>

            {/* =========================
                CHANNEL HEADER
            ========================= */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl">

                    <div className="px-5 sm:px-8 py-7">

                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                            {/* AVATAR */}
                            <div className="flex-shrink-0">

                                {channel.avatar ? (
                                    <img
                                        src={channel.avatar}
                                        alt={channel.username}
                                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 flex items-center justify-center">

                                        <span className="text-3xl font-bold text-gray-500">
                                            {(channel.fullname ||
                                                channel.username ||
                                                "C")[0].toUpperCase()}
                                        </span>

                                    </div>
                                )}

                            </div>

                            {/* CHANNEL DETAILS */}
                            <div className="flex-1">

                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    {channel.fullname}
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    @{channel.username}
                                </p>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">

                                    <div>
                                        <span className="font-semibold text-gray-900">
                                            {channel.subscribersCount}
                                        </span>

                                        <span className="text-gray-500 ml-1">
                                            subscribers
                                        </span>
                                    </div>

                                    <div>
                                        <span className="font-semibold text-gray-900">
                                            {channel.channelsSubscribedToCount}
                                        </span>

                                        <span className="text-gray-500 ml-1">
                                            subscribed
                                        </span>
                                    </div>

                                </div>

                            </div>

                            {/* SUBSCRIBE */}
                            <div>

                                <button
                                    onClick={handleSubscribe}
                                    className={`w-full sm:w-auto px-7 py-3 rounded-full font-semibold transition ${
                                        channel.isSubscribed
                                            ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                            : "bg-black text-white hover:bg-gray-800"
                                    }`}
                                >
                                    {channel.isSubscribed
                                        ? "Unsubscribe"
                                        : "Subscribe"}
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* =========================
                        TABS
                    ========================= */}
                    <div className="border-t border-gray-200 px-5 sm:px-8">

                        <div className="flex items-center gap-8">

                            {/* HOME */}
                            <button
                                onClick={() => setActiveTab("home")}
                                className={`relative py-4 text-sm font-semibold ${
                                    activeTab === "home"
                                        ? "text-black"
                                        : "text-gray-500 hover:text-black"
                                }`}
                            >
                                Home

                                {activeTab === "home" && (
                                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                                )}
                            </button>

                            {/* VIDEOS */}
                            <button
                                onClick={() => setActiveTab("videos")}
                                className={`relative py-4 text-sm font-semibold ${
                                    activeTab === "videos"
                                        ? "text-black"
                                        : "text-gray-500 hover:text-black"
                                }`}
                            >
                                Videos

                                {activeTab === "videos" && (
                                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                                )}
                            </button>

                        </div>

                    </div>

                </div>

                {/* =========================
                    HOME TAB
                ========================= */}
                {activeTab === "home" && (
                    <section className="py-8">

                        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">

                            <h2 className="text-xl font-bold text-gray-900">
                                Welcome to {channel.fullname}'s channel
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Check the Videos tab to see all published videos.
                            </p>

                        </div>

                    </section>
                )}

                {/* =========================
                    VIDEOS TAB
                ========================= */}
                {activeTab === "videos" && (
                    <section className="py-8">

                        <div className="flex items-center justify-between mb-6">

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Videos
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Published videos from this channel
                                </p>
                            </div>

                            <span className="text-sm text-gray-500">
                                {videos.length} videos
                            </span>

                        </div>

                        {/* LOADING VIDEOS */}
                        {videosLoading && (
                            <div className="flex justify-center py-16">

                                <div className="w-9 h-9 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

                            </div>
                        )}

                        {/* VIDEO ERROR */}
                        {!videosLoading && videosError && (
                            <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">

                                <p className="text-red-500">
                                    {videosError}
                                </p>

                                <button
                                    onClick={getChannelVideos}
                                    className="mt-4 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800"
                                >
                                    Try Again
                                </button>

                            </div>
                        )}

                        {/* NO VIDEOS */}
                        {!videosLoading &&
                            !videosError &&
                            videos.length === 0 && (
                                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

                                    <div className="text-4xl mb-4">
                                        🎬
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900">
                                        No videos yet
                                    </h3>

                                    <p className="text-gray-500 mt-1">
                                        This channel hasn't published any videos.
                                    </p>

                                </div>
                            )}

                        {/* VIDEOS GRID */}
                        {!videosLoading &&
                            !videosError &&
                            videos.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {videos.map((video) => (
                                        <div
                                            key={video._id}
                                            onClick={() =>
                                                navigate(`/watch/${video._id}`)
                                            }
                                            className="group cursor-pointer"
                                        >

                                            {/* THUMBNAIL */}
                                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200">

                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />

                                            </div>

                                            {/* VIDEO INFO */}
                                            <div className="mt-3">

                                                <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-gray-600 transition">
                                                    {video.title}
                                                </h3>

                                                <p className="text-sm text-gray-500 mt-2">
                                                    {video.views} views
                                                </p>

                                            </div>

                                        </div>
                                    ))}

                                </div>
                            )}

                    </section>
                )}

            </main>

        </div>
    );
}