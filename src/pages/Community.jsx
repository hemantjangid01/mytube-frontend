import React, { useEffect, useState } from "react";
import axios from "axios";

const Community = () => {
    const API = import.meta.env.VITE_API_URL;

    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const [showMyTweets, setShowMyTweets] = useState(false);

    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // GET CURRENT USER
    // =========================
    const getCurrentUser = async () => {
        try {
            const response = await axios.get(
                `${API}/users/current-user`,
                {
                    withCredentials: true,
                }
            );

            setCurrentUser(response.data.data);
        } catch (error) {
            console.error(
                "Get current user error:",
                error.response?.data || error.message
            );
        }
    };

    // =========================
    // GET ALL TWEETS
    // =========================
    const getAllTweets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API}/tweets/getalltweets`,
                {
                    withCredentials: true,
                }
            );

            setTweets(response.data.data || []);
        } catch (error) {
            console.error(
                "Get all tweets error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load posts"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // GET MY TWEETS
    // =========================
    const getMyTweets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API}/tweets/getusertweets`,
                {
                    withCredentials: true,
                }
            );

            setTweets(response.data.data || []);
        } catch (error) {
            console.error(
                "Get my tweets error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your posts"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOAD TWEETS
    // =========================
    const loadTweets = async () => {
        if (showMyTweets) {
            await getMyTweets();
        } else {
            await getAllTweets();
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        loadTweets();
    }, [showMyTweets]);

    // =========================
    // CHECK OWNER
    // =========================
    const isMyTweet = (tweet) => {
        if (!currentUser || !tweet?.owner) {
            return false;
        }

        const tweetOwnerId =
            typeof tweet.owner === "object"
                ? tweet.owner._id
                : tweet.owner;

        return (
            tweetOwnerId?.toString() ===
            currentUser._id?.toString()
        );
    };

    // =========================
    // CREATE TWEET
    // =========================
    const handleCreateTweet = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setPosting(true);
            setError("");

            await axios.post(
                `${API}/tweets/createtweet`,
                {
                    content: content.trim(),
                },
                {
                    withCredentials: true,
                }
            );

            setContent("");

            await loadTweets();
        } catch (error) {
            console.error(
                "Create tweet error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to create post"
            );
        } finally {
            setPosting(false);
        }
    };

    // =========================
    // START EDIT
    // =========================
    const startEdit = (tweet) => {
        if (!isMyTweet(tweet)) return;

        setEditingId(tweet._id);
        setEditContent(tweet.content);
        setError("");
    };

    // =========================
    // UPDATE TWEET
    // =========================
    const handleUpdateTweet = async (tweetId) => {
        if (!editContent.trim()) return;

        try {
            setError("");

            await axios.patch(
                `${API}/tweets/updatetweet/${tweetId}`,
                {
                    content: editContent.trim(),
                },
                {
                    withCredentials: true,
                }
            );

            setEditingId(null);
            setEditContent("");

            await loadTweets();
        } catch (error) {
            console.error(
                "Update tweet error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to update post"
            );
        }
    };

    // =========================
    // DELETE TWEET
    // =========================
    const handleDeleteTweet = async (tweetId) => {
        const tweet = tweets.find(
            (item) => item._id === tweetId
        );

        if (!tweet || !isMyTweet(tweet)) {
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) return;

        try {
            setError("");

            await axios.delete(
                `${API}/tweets/deletetweet/${tweetId}`,
                {
                    withCredentials: true,
                }
            );

            setTweets((prev) =>
                prev.filter(
                    (tweet) => tweet._id !== tweetId
                )
            );
        } catch (error) {
            console.error(
                "Delete tweet error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete post"
            );
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading && tweets.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

                    <p className="text-sm text-gray-500">
                        Loading community...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

                {/* =========================
                    HEADER
                ========================= */}
                <div className="mb-8">

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Community
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Share your thoughts and connect with other users.
                    </p>

                </div>

                {/* =========================
                    ERROR
                ========================= */}
                {error && (
                    <div className="mb-6 flex items-start justify-between gap-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">

                        <p className="text-sm text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="text-red-500 hover:text-red-700 font-bold"
                        >
                            ×
                        </button>

                    </div>
                )}

                {/* =========================
                    CREATE POST
                ========================= */}
                <form
                    onSubmit={handleCreateTweet}
                    className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6"
                >

                    <div className="flex items-center gap-3 mb-5">

                        {currentUser?.avatar ? (
                            <img
                                src={currentUser.avatar}
                                alt="Your avatar"
                                className="w-11 h-11 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                                👤
                            </div>
                        )}

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Create a post
                            </h2>

                            <p className="text-xs text-gray-500">
                                Share something with the community
                            </p>
                        </div>

                    </div>

                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        placeholder="What's happening?"
                        rows={4}
                        className="w-full border border-gray-300 rounded-xl p-4 resize-none outline-none text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition"
                    />

                    <div className="flex justify-end mt-4">

                        <button
                            type="submit"
                            disabled={posting || !content.trim()}
                            className="px-6 py-2.5 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {posting ? "Posting..." : "Post"}
                        </button>

                    </div>

                </form>

                {/* =========================
                    FILTERS
                ========================= */}
                <div className="bg-white border border-gray-200 rounded-xl p-1.5 flex mb-7 shadow-sm">

                    <button
                        type="button"
                        onClick={() => setShowMyTweets(false)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                            !showMyTweets
                                ? "bg-black text-white"
                                : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        All Posts
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowMyTweets(true)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                            showMyTweets
                                ? "bg-black text-white"
                                : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        My Posts
                    </button>

                </div>

                {/* =========================
                    POSTS HEADER
                ========================= */}
                <div className="flex items-center justify-between mb-5">

                    <h2 className="text-xl font-bold text-gray-900">
                        {showMyTweets ? "My Posts" : "All Posts"}
                    </h2>

                    {loading && (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    )}

                </div>

                {/* =========================
                    EMPTY STATE
                ========================= */}
                {!loading && tweets.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">

                        <div className="text-4xl mb-4">
                            💬
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900">
                            {showMyTweets
                                ? "No posts yet"
                                : "No posts yet"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            {showMyTweets
                                ? "You haven't posted anything yet."
                                : "Be the first person to start the conversation."}
                        </p>

                    </div>
                )}

                {/* =========================
                    POSTS
                ========================= */}
                {tweets.length > 0 && (
                    <div className="space-y-4">

                        {tweets.map((tweet) => (
                            <article
                                key={tweet._id}
                                className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm"
                            >

                                {/* =========================
                                    OWNER
                                ========================= */}
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        {tweet.owner?.avatar ? (
                                            <img
                                                src={tweet.owner.avatar}
                                                alt="avatar"
                                                className="w-11 h-11 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                                                👤
                                            </div>
                                        )}

                                        <div>

                                            <h3 className="font-semibold text-gray-900">
                                                {tweet.owner?.fullname ||
                                                    tweet.owner?.username ||
                                                    "Unknown User"}
                                            </h3>

                                            {tweet.owner?.username && (
                                                <p className="text-sm text-gray-500">
                                                    @{tweet.owner.username}
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                {/* =========================
                                    CONTENT / EDIT
                                ========================= */}
                                <div className="mt-5">

                                    {editingId === tweet._id ? (
                                        <div>

                                            <textarea
                                                value={editContent}
                                                onChange={(e) =>
                                                    setEditContent(
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                                className="w-full border border-gray-300 rounded-xl p-4 resize-none outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                            />

                                            <div className="flex gap-2 mt-3">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleUpdateTweet(
                                                            tweet._id
                                                        )
                                                    }
                                                    disabled={!editContent.trim()}
                                                    className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40"
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setEditContent("");
                                                    }}
                                                    className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>
                                    ) : (
                                        <>

                                            <p className="text-[16px] text-gray-800 leading-7 whitespace-pre-wrap break-words">
                                                {tweet.content}
                                            </p>

                                            {/* =========================
                                                MY POST ACTIONS
                                            ========================= */}
                                            {isMyTweet(tweet) && (
                                                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            startEdit(tweet)
                                                        }
                                                        className="text-sm font-medium text-gray-500 hover:text-black transition"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteTweet(
                                                                tweet._id
                                                            )
                                                        }
                                                        className="text-sm font-medium text-gray-500 hover:text-red-600 transition"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            )}

                                        </>
                                    )}

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </main>

        </div>
    );
};

export default Community;