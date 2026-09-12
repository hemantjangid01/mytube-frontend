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
                console.error(
                    "Get video error:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load video"
                );
            } finally {
                setLoading(false);
            }
        };

        getVideo();
    }, [videoId]);

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

            const response = await axios.patch(
                `${API}/${videoId}`,
                formData,
                {
                    withCredentials: true,
                }
            );

            console.log("Update response:", response.data);

            navigate("/my-videos");
        } catch (error) {
            console.error(
                "Update video error:",
                error.response?.data || error.message
            );

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

                    <p className="text-gray-500 text-sm">
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Video not found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        The video may have been deleted or doesn't exist.
                    </p>

                    <button
                        onClick={() => navigate("/my-videos")}
                        className="mt-6 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                    >
                        Back to My Videos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* =========================
                    PAGE HEADER
                ========================= */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => navigate("/my-videos")}
                        className="text-sm text-gray-500 hover:text-black transition mb-4"
                    >
                        ← Back to My Videos
                    </button>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Edit Video
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Update your video's title, description, or thumbnail.
                    </p>
                </div>

                {/* =========================
                    FORM CARD
                ========================= */}
                <form
                    onSubmit={handleUpdate}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                >

                    {/* =========================
                        THUMBNAIL SECTION
                    ========================= */}
                    <div className="p-6 md:p-8 border-b border-gray-200">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Thumbnail
                        </h2>

                        <p className="text-sm text-gray-500 mt-1 mb-5">
                            This is the current thumbnail for your video.
                        </p>

                        <div className="max-w-2xl">
                            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
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
                                className="block text-sm font-semibold text-gray-900 mb-2"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition"
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Give your video a clear and descriptive title.
                            </p>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold text-gray-900 mb-2"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-gray-900 placeholder-gray-400 resize-y focus:border-black focus:ring-1 focus:ring-black transition"
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Tell viewers what your video is about.
                            </p>
                        </div>

                        {/* CHANGE THUMBNAIL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Change Thumbnail
                            </label>

                            <label className="flex flex-col items-center justify-center w-full max-w-2xl h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition">

                                <div className="text-center px-4">

                                    <div className="text-3xl mb-2">
                                        🖼️
                                    </div>

                                    <p className="text-sm font-medium text-gray-700">
                                        {thumbnail
                                            ? thumbnail.name
                                            : "Choose a new thumbnail"}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
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
                                <div className="mt-4 max-w-2xl">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        New thumbnail preview
                                    </p>

                                    <img
                                        src={URL.createObjectURL(thumbnail)}
                                        alt="New thumbnail preview"
                                        className="w-full aspect-video object-cover rounded-xl border border-gray-200"
                                    />
                                </div>
                            )}
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                    </div>

                    {/* =========================
                        ACTIONS
                    ========================= */}
                    <div className="px-6 md:px-8 py-5 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/my-videos")
                            }
                            disabled={updating}
                            className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={updating}
                            className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {updating
                                ? "Updating..."
                                : "Update Video"}
                        </button>

                    </div>

                </form>

            </main>
        </div>
    );
}