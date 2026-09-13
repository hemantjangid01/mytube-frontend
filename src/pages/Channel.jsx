
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

    // =========================
    // GET CHANNEL
    // =========================
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
            const message =
                   error.response?.data||
                 (typeof error.response?.data === "string"
                     ? error.response.data
                        : null) ||
                       "Failed to update subscription";

    setError(message);
}
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin" />

                    <p className="text-sm text-[#64748B]">
                        Loading channel...
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (error && !channel) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center shadow-sm max-w-md w-full">

                    <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v3.75m0 3.75h.01M10.29 3.86l-7.5 13A2 2 0 004.53 20h14.94a2 2 0 001.74-3.14l-7.5-13a2 2 0 00-3.42 0Z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-xl font-bold text-[#0F172A] mt-5">
                        Something went wrong
                    </h2>

                    <p className="text-[#64748B] mt-2">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={getChannel}
                        className="
                            mt-6 px-5 py-2.5
                            bg-[#2563EB]
                            text-white
                            rounded-xl
                            font-semibold text-sm
                            hover:bg-[#1D4ED8]
                            transition
                        "
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
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2Z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-[#0F172A] mt-5">
                        Channel not found
                    </h2>

                    <p className="text-[#64748B] mt-2">
                        This channel doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            {/* =========================
                COVER IMAGE
            ========================= */}
            <div className="w-full">
                <div className="relative w-full h-52 sm:h-64 md:h-72 bg-slate-200 overflow-hidden">
                    {channel.coverimage ? (
                        <img
                            src={channel.coverimage}
                            alt="Channel cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100" />
                    )}

                    <div className="absolute inset-0 bg-black/5" />
                </div>
            </div>

            {/* =========================
                CHANNEL HEADER
            ========================= */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="bg-white border-x border-b border-[#E2E8F0] rounded-b-2xl shadow-sm">

                    <div className="px-5 sm:px-8 py-7">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                            {/* AVATAR */}
                            <div className="flex-shrink-0">
                                {channel.avatar ? (
                                    <img
                                        src={channel.avatar}
                                        alt={channel.username}
                                        className="
                                            w-24 h-24
                                            sm:w-28 sm:h-28
                                            rounded-full
                                            object-cover
                                            border-4 border-white
                                            shadow-lg
                                        "
                                    />
                                ) : (
                                    <div className="
                                        w-24 h-24
                                        sm:w-28 sm:h-28
                                        rounded-full
                                        bg-blue-50
                                        border-4 border-white
                                        shadow-lg
                                        flex items-center justify-center
                                    ">
                                        <span className="text-3xl font-bold text-[#2563EB]">
                                            {(channel.fullname ||
                                                channel.username ||
                                                "C")[0].toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* CHANNEL DETAILS */}
                            <div className="flex-1 min-w-0">

                                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] truncate">
                                    {channel.fullname}
                                </h1>

                                <p className="text-[#64748B] mt-1">
                                    @{channel.username}
                                </p>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">

                                    <div>
                                        <span className="font-bold text-[#0F172A]">
                                            {channel.subscribersCount}
                                        </span>

                                        <span className="text-[#64748B] ml-1">
                                            subscribers
                                        </span>
                                    </div>

                                    <div>
                                        <span className="font-bold text-[#0F172A]">
                                            {channel.channelsSubscribedToCount}
                                        </span>

                                        <span className="text-[#64748B] ml-1">
                                            subscribed
                                        </span>
                                    </div>

                                </div>
                            </div>

                            {/* SUBSCRIBE */}
                            <div>
                                <button
                                    type="button"
                                    onClick={handleSubscribe}
                                    className={`w-full sm:w-auto px-7 py-3 rounded-full font-semibold text-sm transition ${
                                        channel.isSubscribed
                                            ? "bg-slate-100 text-[#475569] hover:bg-slate-200"
                                            : "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm"
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
                    <div className="border-t border-[#E2E8F0] px-5 sm:px-8">

                        <div className="flex items-center gap-8">

                            {/* HOME */}
                            <button
                                type="button"
                                onClick={() => setActiveTab("home")}
                                className={`relative py-4 text-sm font-semibold transition ${
                                    activeTab === "home"
                                        ? "text-[#2563EB]"
                                        : "text-[#64748B] hover:text-[#2563EB]"
                                }`}
                            >
                                Home

                                {activeTab === "home" && (
                                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#2563EB] rounded-full" />
                                )}
                            </button>

                            {/* VIDEOS */}
                            <button
                                type="button"
                                onClick={() => setActiveTab("videos")}
                                className={`relative py-4 text-sm font-semibold transition ${
                                    activeTab === "videos"
                                        ? "text-[#2563EB]"
                                        : "text-[#64748B] hover:text-[#2563EB]"
                                }`}
                            >
                                Videos

                                {activeTab === "videos" && (
                                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#2563EB] rounded-full" />
                                )}
                            </button>

                        </div>
                    </div>
                </div>

                {/* =========================
                    PAGE ERROR
                ========================= */}
                {error && channel && (
                    <div className="mt-6 flex items-start justify-between gap-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 shrink-0 mt-0.5 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v3.75m0 3.75h.01M10.29 3.86l-7.5 13A2 2 0 004.53 20h14.94a2 2 0 001.74-3.14l-7.5-13a2 2 0 00-3.42 0Z"
                                />
                            </svg>

                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="text-red-400 hover:text-red-600 text-xl leading-none"
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* =========================
                    HOME TAB
                ========================= */}
                {activeTab === "home" && (
                    <section className="py-8">
                        <div className="
                            bg-white
                            border border-[#E2E8F0]
                            rounded-2xl
                            p-8
                            text-center
                            shadow-sm
                        ">
                            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M3 10.5L12 3l9 7.5M5.5 9v10.5h13V9M9 19.5v-6h6v6"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-xl font-bold text-[#0F172A] mt-5">
                                Welcome to {channel.fullname}'s channel
                            </h2>

                            <p className="text-[#64748B] mt-2">
                                Check the Videos tab to see all published videos.
                            </p>

                            <button
                                type="button"
                                onClick={() => setActiveTab("videos")}
                                className="
                                    mt-5
                                    px-5 py-2.5
                                    rounded-full
                                    bg-blue-50
                                    text-[#2563EB]
                                    text-sm
                                    font-semibold
                                    hover:bg-blue-100
                                    transition
                                "
                            >
                                View Videos
                            </button>
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
                                <h2 className="text-2xl font-bold text-[#0F172A]">
                                    Videos
                                </h2>

                                <p className="text-sm text-[#64748B] mt-1">
                                    Published videos from this channel
                                </p>
                            </div>

                            <span className="
                                text-xs sm:text-sm
                                font-semibold
                                text-[#2563EB]
                                bg-blue-50
                                px-3 py-1.5
                                rounded-full
                            ">
                                {videos.length} videos
                            </span>
                        </div>

                        {/* LOADING VIDEOS */}
                        {videosLoading && (
                            <div className="flex justify-center py-16">
                                <div className="w-9 h-9 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin" />
                            </div>
                        )}

                        {/* VIDEO ERROR */}
                        {!videosLoading && videosError && (
                            <div className="
                                bg-white
                                border border-red-200
                                rounded-2xl
                                p-8
                                text-center
                                shadow-sm
                            ">
                                <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v3.75m0 3.75h.01M10.29 3.86l-7.5 13A2 2 0 004.53 20h14.94a2 2 0 001.74-3.14l-7.5-13a2 2 0 00-3.42 0Z"
                                        />
                                    </svg>
                                </div>

                                <p className="text-red-600 text-sm mt-4">
                                    {videosError}
                                </p>

                                <button
                                    type="button"
                                    onClick={getChannelVideos}
                                    className="
                                        mt-4
                                        px-5 py-2.5
                                        bg-[#2563EB]
                                        text-white
                                        rounded-xl
                                        text-sm
                                        font-semibold
                                        hover:bg-[#1D4ED8]
                                        transition
                                    "
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* NO VIDEOS */}
                        {!videosLoading &&
                            !videosError &&
                            videos.length === 0 && (
                                <div className="
                                    bg-white
                                    border border-[#E2E8F0]
                                    rounded-2xl
                                    p-12
                                    text-center
                                    shadow-sm
                                ">
                                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
                                        <svg
                                            className="w-7 h-7"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2Z"
                                            />
                                        </svg>
                                    </div>

                                    <h3 className="text-lg font-semibold text-[#0F172A] mt-4">
                                        No videos yet
                                    </h3>

                                    <p className="text-[#64748B] mt-1">
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
                                        <article
                                            key={video._id}
                                            onClick={() =>
                                                navigate(`/watch/${video._id}`)
                                            }
                                            className="group cursor-pointer"
                                        >
                                            {/* THUMBNAIL */}
                                            <div className="
                                                relative
                                                aspect-video
                                                rounded-xl
                                                overflow-hidden
                                                bg-slate-200
                                            ">
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="
                                                        w-full h-full
                                                        object-cover
                                                        transition-transform
                                                        duration-300
                                                        group-hover:scale-[1.03]
                                                    "
                                                />

                                                <div className="
                                                    absolute inset-0
                                                    bg-black/0
                                                    group-hover:bg-black/10
                                                    transition-colors
                                                " />

                                                <div className="
                                                    absolute inset-0
                                                    flex items-center justify-center
                                                    opacity-0
                                                    group-hover:opacity-100
                                                    transition-opacity
                                                ">
                                                    <div className="
                                                        w-11 h-11
                                                        rounded-full
                                                        bg-white/95
                                                        shadow-lg
                                                        flex items-center justify-center
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

                                            {/* VIDEO INFO */}
                                            <div className="mt-3">
                                                <h3 className="
                                                    font-semibold
                                                    text-[#0F172A]
                                                    line-clamp-2
                                                    leading-snug
                                                    group-hover:text-[#2563EB]
                                                    transition-colors
                                                ">
                                                    {video.title}
                                                </h3>

                                                <p className="text-sm text-[#64748B] mt-2">
                                                    {video.views || 0} views
                                                </p>
                                            </div>
                                        </article>
                                    ))}

                                </div>
                            )}
                    </section>
                )}
            </main>
        </div>
    );
}
