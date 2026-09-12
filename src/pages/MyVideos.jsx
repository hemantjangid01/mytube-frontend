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

            console.log("My videos:", response.data);

            setVideos(response.data.data || []);
        } catch (error) {
            console.error(
                "Get my videos error:",
                error.response?.data || error.message
            );

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
            console.error(
                "Delete error:",
                error.response?.data || error.message
            );
        }
    };

    // Publish / Unpublish
    const handleTogglePublish = async (videoId) => {
        try {
            const response = await axios.patch(
                `${API}/videos/${videoId}/toggle/publish`,
                {},
                {
                    withCredentials: true,
                }
            );

            console.log("Publish response:", response.data);

            // Update the video in state
            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video._id === videoId
                        ? {
                              ...video,
                              isPublished:
                                  !video.isPublished,
                          }
                        : video
                )
            );
        } catch (error) {
            console.error(
                "Publish toggle error:",
                error.response?.data || error.message
            );
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading your videos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    My Videos
                </h1>

                <button
                    onClick={() => navigate("/upload")}
                    className="px-5 py-3 rounded-xl border-2 border-blue-400"
                >
                    Upload Video
                </button>
            </div>

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            {videos.length === 0 && !error && (
                <p>You haven't uploaded any videos yet.</p>
            )}

            <div className="space-y-5">

                {videos.map((video) => (
                    <div
                        key={video._id}
                        className="flex gap-5 border rounded-2xl p-4"
                    >

                        {/* Thumbnail */}
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-64 h-36 object-cover rounded-xl"
                        />

                        {/* Video information */}
                        <div className="flex-1">

                            <h2 className="text-xl font-semibold">
                                {video.title}
                            </h2>

                            <p className="mt-2 text-gray-600">
                                {video.description}
                            </p>

                            <p className="mt-2">
                                Status:{" "}
                                <span className="font-medium">
                                    {video.isPublished
                                        ? "Published"
                                        : "Unpublished"}
                                </span>
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-4">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/edit-video/${video._id}`
                                        )
                                    }
                                    className="px-4 py-2 rounded-lg border"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(video._id)
                                    }
                                    className="px-4 py-2 rounded-lg border"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() =>
                                        handleTogglePublish(
                                            video._id
                                        )
                                    }
                                    className="px-4 py-2 rounded-lg border"
                                >
                                    {video.isPublished
                                        ? "Unpublish"
                                        : "Publish"}
                                </button>

                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}