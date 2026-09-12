
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditVideo() {
    const API = import.meta.env.VITE_API_URL;
    const { videoId } = useParams();
    const navigate = useNavigate();

    const [video, setVideo] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // FETCH VIDEO
    // =========================
    useEffect(() => {
        const getVideo = async () => {
            try {
                const response = await axios.get(
                    `${API}/videos/${videoId}`,
                    {
                        withCredentials: true,
                    }
                );

                const data = response.data.data;

                setVideo(data);
                setTitle(data.title || "");
                setDescription(data.description || "");
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load video"
                );
            } finally {
                setLoading(false);
            }
        };

        getVideo();
    }, [API, videoId]);

    // =========================
    // UPDATE VIDEO
    // =========================
    const handleUpdate = async (e) => {
        e.preventDefault();

        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (!description.trim()) {
            setError("Description is required");
            return;
        }

        try {
            setUpdating(true);

            const formData = new FormData();

            formData.append("title", title.trim());
            formData.append("description", description.trim());

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            await axios.patch(
                `${API}/${videoId}`,
                formData,
                {
                    withCredentials: true,
                }
            );

            navigate("/my-videos");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update video"
            );
        } finally {
            setUpdating(false);
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
                        Loading video...
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // VIDEO NOT FOUND
    // =========================
    if (!video) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center shadow-sm">
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

                    <h2 className="mt-5 text-2xl font-bold text-[#0F172A]">
                        Video not found
                    </h2>

                    <p className="mt-2 text-sm text-[#64748B] leading-6">
                        The video may have been deleted or doesn't exist.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/my-videos")}
                        className="
                            mt-6 px-5 py-2.5 rounded-xl
                            bg-[#2563EB] text-white
                            font-semibold text-sm
                            hover:bg-[#1D4ED8]
                            transition
                        "
                    >
                        Back to My Videos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* =========================
                    PAGE HEADER
                ========================= */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => navigate("/my-videos")}
                        className="
                            inline-flex items-center gap-2
                            text-sm font-medium text-[#64748B]
                            hover:text-[#2563EB]
                            transition mb-4
                        "
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>

                        Back to My Videos
                    </button>

                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]">
                        Edit Video
                    </h1>

                    <p className="text-[#64748B] mt-2">
                        Update your video's title, description, or thumbnail.
                    </p>
                </div>

                {/* =========================
                    FORM CARD
                ========================= */}
                <form
                    onSubmit={handleUpdate}
                    className="
                        bg-white
                        border border-[#E2E8F0]
                        rounded-2xl
                        shadow-sm
                        overflow-hidden
                    "
                >

                    {/* =========================
                        THUMBNAIL SECTION
                    ========================= */}
                    <div className="p-6 md:p-8 border-b border-[#E2E8F0]">

                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
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
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2Z"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-[#0F172A]">
                                    Thumbnail
                                </h2>

                                <p className="text-sm text-[#64748B] mt-1">
                                    This is the current thumbnail for your video.
                                </p>
                            </div>
                        </div>

                        <div className="max-w-2xl">
                            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-[#E2E8F0]">
                                <img
                                    src={video.thumbnail}
                                    alt="Current thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        VIDEO DETAILS
                    ========================= */}
                    <div className="p-6 md:p-8 space-y-7">

                        {/* TITLE */}
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-semibold text-[#0F172A] mb-2"
                            >
                                Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="Enter video title"
                                className="
                                    w-full px-4 py-3
                                    bg-white
                                    border border-[#CBD5E1]
                                    rounded-xl
                                    outline-none
                                    text-[#0F172A]
                                    placeholder-[#94A3B8]
                                    focus:border-[#2563EB]
                                    focus:ring-2 focus:ring-blue-100
                                    transition
                                "
                            />

                            <p className="text-xs text-[#94A3B8] mt-2">
                                Give your video a clear and descriptive title.
                            </p>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold text-[#0F172A] mb-2"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Enter video description"
                                rows={7}
                                className="
                                    w-full px-4 py-3
                                    bg-white
                                    border border-[#CBD5E1]
                                    rounded-xl
                                    outline-none
                                    text-[#0F172A]
                                    placeholder-[#94A3B8]
                                    resize-y
                                    focus:border-[#2563EB]
                                    focus:ring-2 focus:ring-blue-100
                                    transition
                                "
                            />

                            <p className="text-xs text-[#94A3B8] mt-2">
                                Tell viewers what your video is about.
                            </p>
                        </div>

                        {/* CHANGE THUMBNAIL */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                                Change Thumbnail
                            </label>

                            <label
                                className="
                                    flex flex-col items-center justify-center
                                    w-full max-w-2xl h-40
                                    border-2 border-dashed
                                    border-[#CBD5E1]
                                    rounded-xl
                                    cursor-pointer
                                    bg-[#F8FAFC]
                                    hover:bg-blue-50
                                    hover:border-[#2563EB]
                                    transition
                                "
                            >
                                <div className="text-center px-4">

                                    <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
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
                                                d="M12 16V4m0 0L8 8m4-4l4 4M5 20h14"
                                            />
                                        </svg>
                                    </div>

                                    <p className="text-sm font-semibold text-[#0F172A]">
                                        {thumbnail
                                            ? thumbnail.name
                                            : "Choose a new thumbnail"}
                                    </p>

                                    <p className="text-xs text-[#94A3B8] mt-1">
                                        PNG, JPG, JPEG or other image formats
                                    </p>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setThumbnail(
                                            e.target.files[0] || null
                                        )
                                    }
                                />
                            </label>

                            {/* NEW THUMBNAIL PREVIEW */}
                            {thumbnail && (
                                <div className="mt-5 max-w-2xl">
                                    <p className="text-sm font-semibold text-[#0F172A] mb-2">
                                        New thumbnail preview
                                    </p>

                                    <div className="aspect-video rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-100">
                                        <img
                                            src={URL.createObjectURL(thumbnail)}
                                            alt="New thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                <svg
                                    className="w-5 h-5 shrink-0 mt-0.5"
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

                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* =========================
                        ACTIONS
                    ========================= */}
                    <div className="
                        px-6 md:px-8 py-5
                        bg-[#F8FAFC]
                        border-t border-[#E2E8F0]
                        flex flex-col-reverse
                        sm:flex-row sm:justify-end
                        gap-3
                    ">

                        <button
                            type="button"
                            onClick={() => navigate("/my-videos")}
                            disabled={updating}
                            className="
                                px-6 py-3
                                rounded-xl
                                border border-[#CBD5E1]
                                bg-white
                                text-[#475569]
                                font-semibold text-sm
                                hover:bg-slate-50
                                hover:border-[#94A3B8]
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={updating}
                            className="
                                px-6 py-3
                                rounded-xl
                                bg-[#2563EB]
                                text-white
                                font-semibold text-sm
                                hover:bg-[#1D4ED8]
                                transition
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                shadow-sm
                            "
                        >
                            {updating ? "Updating..." : "Update Video"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
