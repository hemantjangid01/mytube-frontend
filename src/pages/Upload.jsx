import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Upload() {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!title.trim() || !description.trim()) {
            setError("Title and description are required");
            return;
        }

        if (!videoFile) {
            setError("Please select a video");
            return;
        }

        if (!thumbnail) {
            setError("Please select a thumbnail");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("title", title.trim());
            formData.append("description", description.trim());
            formData.append("videoFile", videoFile);
            formData.append("thumbnail", thumbnail);

            const response = await axios.post(
                `${API}/videos/publishVideo`,
                formData,
                {
                    withCredentials: true,
                }
            );

            console.log("Upload response:", response.data);

            setSuccess("Video uploaded successfully!");

            setTitle("");
            setDescription("");
            setVideoFile(null);
            setThumbnail(null);

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.error(
                "Upload error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to upload video"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="max-w-3xl mx-auto mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Upload Video
                </h1>

                <p className="mt-2 text-gray-500">
                    Share your video with the community
                </p>

            </div>

            {/* =========================
                FORM CARD
            ========================= */}

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-7"
                >

                    {/* =========================
                        TITLE
                    ========================= */}

                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Video Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your video title"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        />
                    </div>

                    {/* =========================
                        DESCRIPTION
                    ========================= */}

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Tell viewers what your video is about..."
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none resize-none transition focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        />
                    </div>

                    {/* =========================
                        VIDEO FILE
                    ========================= */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Video
                        </label>

                        <label className="flex flex-col items-center justify-center w-full min-h-36 px-6 py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition">

                            {videoFile ? (
                                <div className="text-center">

                                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 19h8a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>

                                    <p className="font-medium text-gray-800 break-all">
                                        {videoFile.name}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>

                                    <p className="text-xs text-red-600 mt-2">
                                        Click to change video
                                    </p>

                                </div>
                            ) : (
                                <div className="text-center">

                                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                                            />
                                        </svg>
                                    </div>

                                    <p className="font-medium text-gray-700">
                                        Select your video
                                    </p>

                                    <p className="text-sm text-gray-400 mt-1">
                                        MP4, WebM, MOV and other video formats
                                    </p>

                                </div>
                            )}

                            <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) =>
                                    setVideoFile(
                                        e.target.files[0] || null
                                    )
                                }
                            />

                        </label>

                    </div>

                    {/* =========================
                        THUMBNAIL
                    ========================= */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thumbnail
                        </label>

                        <label className="flex flex-col items-center justify-center w-full min-h-36 px-6 py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition overflow-hidden">

                            {thumbnail ? (
                                <div className="flex flex-col items-center">

                                    <img
                                        src={URL.createObjectURL(thumbnail)}
                                        alt="Thumbnail preview"
                                        className="w-52 h-28 object-cover rounded-lg shadow-sm mb-3"
                                    />

                                    <p className="font-medium text-gray-800 break-all text-center">
                                        {thumbnail.name}
                                    </p>

                                    <p className="text-xs text-red-600 mt-2">
                                        Click to change thumbnail
                                    </p>

                                </div>
                            ) : (
                                <div className="text-center">

                                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z"
                                            />
                                        </svg>
                                    </div>

                                    <p className="font-medium text-gray-700">
                                        Select a thumbnail
                                    </p>

                                    <p className="text-sm text-gray-400 mt-1">
                                        JPG, PNG or JPEG
                                    </p>

                                </div>
                            )}

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

                    </div>

                    {/* =========================
                        MESSAGES
                    ========================= */}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                            <p className="text-sm text-green-600">
                                {success}
                            </p>
                        </div>
                    )}

                    {/* =========================
                        SUBMIT
                    ========================= */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-red-600 text-white font-semibold transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Uploading video..."
                            : "Publish Video"}
                    </button>

                </form>

            </div>

        </div>
    );
}