
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
            setCurrentUser(null);
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
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin" />

                    <p className="text-sm text-[#64748B]">
                        Loading community...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

                {/* =========================
                    HEADER
                ========================= */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
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
                                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.8 9.8 0 01-4-.84L3 20l1.08-4.32A7.6 7.6 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
                                Community
                            </h1>

                            <p className="text-[#64748B] mt-1">
                                Share your thoughts and connect with other users.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =========================
                    ERROR
                ========================= */}
                {error && (
                    <div className="mb-6 flex items-start justify-between gap-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
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
                            aria-label="Dismiss error"
                            className="text-red-400 hover:text-red-600 text-xl leading-none"
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
                    className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm mb-6"
                >
                    <div className="flex items-center gap-3 mb-5">
                        {currentUser?.avatar ? (
                            <img
                                src={currentUser.avatar}
                                alt="Your avatar"
                                className="w-11 h-11 rounded-full object-cover border border-[#E2E8F0]"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
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
                                        strokeWidth="1.8"
                                        d="M15 19a6 6 0 00-12 0m6-8a4 4 0 100-8 4 4 0 000 8Zm6 1a3 3 0 100-6m2.5 13a5 5 0 00-3.5-4.77"
                                    />
                                </svg>
                            </div>
                        )}

                        <div>
                            <h2 className="font-semibold text-[#0F172A]">
                                Create a post
                            </h2>

                            <p className="text-xs text-[#64748B]">
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
                        className="
                            w-full
                            border border-[#CBD5E1]
                            rounded-xl
                            p-4
                            resize-none
                            outline-none
                            text-[#0F172A]
                            placeholder-[#94A3B8]
                            bg-white
                            focus:border-[#2563EB]
                            focus:ring-2 focus:ring-blue-100
                            transition
                        "
                    />

                    <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-[#94A3B8]">
                            {content.length > 0
                                ? `${content.length} characters`
                                : "Share something meaningful"}
                        </span>

                        <button
                            type="submit"
                            disabled={posting || !content.trim()}
                            className="
                                px-6 py-2.5
                                rounded-full
                                bg-[#2563EB]
                                text-white
                                font-semibold text-sm
                                hover:bg-[#1D4ED8]
                                transition
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                            "
                        >
                            {posting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </form>

                {/* =========================
                    FILTERS
                ========================= */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-1.5 flex mb-7 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setShowMyTweets(false)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                            !showMyTweets
                                ? "bg-[#2563EB] text-white shadow-sm"
                                : "text-[#64748B] hover:bg-blue-50 hover:text-[#2563EB]"
                        }`}
                    >
                        All Posts
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowMyTweets(true)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                            showMyTweets
                                ? "bg-[#2563EB] text-white shadow-sm"
                                : "text-[#64748B] hover:bg-blue-50 hover:text-[#2563EB]"
                        }`}
                    >
                        My Posts
                    </button>
                </div>

                {/* =========================
                    POSTS HEADER
                ========================= */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-[#0F172A]">
                        {showMyTweets ? "My Posts" : "All Posts"}
                    </h2>

                    {loading && (
                        <div className="w-5 h-5 border-2 border-blue-100 border-t-[#2563EB] rounded-full animate-spin" />
                    )}
                </div>

                {/* =========================
                    EMPTY STATE
                ========================= */}
                {!loading && tweets.length === 0 && (
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-sm">
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
                                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.8 9.8 0 01-4-.84L3 20l1.08-4.32A7.6 7.6 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                                />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-[#0F172A] mt-4">
                            No posts yet
                        </h3>

                        <p className="text-sm text-[#64748B] mt-2">
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
                                className="
                                    bg-white
                                    border border-[#E2E8F0]
                                    rounded-2xl
                                    p-5 sm:p-6
                                    shadow-sm
                                    hover:shadow-md
                                    transition-shadow
                                "
                            >
                                {/* OWNER */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {tweet.owner?.avatar ? (
                                            <img
                                                src={tweet.owner.avatar}
                                                alt="avatar"
                                                className="w-11 h-11 rounded-full object-cover border border-[#E2E8F0]"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
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
                                                        strokeWidth="1.8"
                                                        d="M15 19a6 6 0 00-12 0m6-8a4 4 0 100-8 4 4 0 000 8Zm6 1a3 3 0 100-6m2.5 13a5 5 0 00-3.5-4.77"
                                                    />
                                                </svg>
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-[#0F172A] truncate">
                                                {tweet.owner?.fullname ||
                                                    tweet.owner?.username ||
                                                    "Unknown User"}
                                            </h3>

                                            {tweet.owner?.username && (
                                                <p className="text-sm text-[#64748B]">
                                                    @{tweet.owner.username}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isMyTweet(tweet) && (
                                        <span className="text-xs font-medium text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full">
                                            You
                                        </span>
                                    )}
                                </div>

                                {/* CONTENT / EDIT */}
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
                                                className="
                                                    w-full
                                                    border border-[#CBD5E1]
                                                    rounded-xl
                                                    p-4
                                                    resize-none
                                                    outline-none
                                                    text-[#0F172A]
                                                    focus:border-[#2563EB]
                                                    focus:ring-2 focus:ring-blue-100
                                                    transition
                                                "
                                            />

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleUpdateTweet(
                                                            tweet._id
                                                        )
                                                    }
                                                    disabled={
                                                        !editContent.trim()
                                                    }
                                                    className="
                                                        px-5 py-2
                                                        rounded-full
                                                        bg-[#2563EB]
                                                        text-white
                                                        text-sm
                                                        font-semibold
                                                        hover:bg-[#1D4ED8]
                                                        transition
                                                        disabled:opacity-40
                                                        disabled:cursor-not-allowed
                                                    "
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setEditContent("");
                                                    }}
                                                    className="
                                                        px-5 py-2
                                                        rounded-full
                                                        bg-slate-100
                                                        text-[#475569]
                                                        text-sm
                                                        font-semibold
                                                        hover:bg-slate-200
                                                        transition
                                                    "
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="
                                                text-[16px]
                                                text-[#334155]
                                                leading-7
                                                whitespace-pre-wrap
                                                break-words
                                            ">
                                                {tweet.content}
                                            </p>

                                            {/* MY POST ACTIONS */}
                                            {isMyTweet(tweet) && (
                                                <div className="
                                                    flex items-center gap-4
                                                    mt-5 pt-4
                                                    border-t border-[#F1F5F9]
                                                ">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            startEdit(tweet)
                                                        }
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-[#64748B]
                                                            hover:text-[#2563EB]
                                                            transition
                                                        "
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
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-[#64748B]
                                                            hover:text-red-600
                                                            transition
                                                        "
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
