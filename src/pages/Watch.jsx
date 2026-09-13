import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Watch = () => {
  const { videoId } = useParams();

  const API = import.meta.env.VITE_API_URL;

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [commentText, setCommentText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [loading, setLoading] = useState(true);

  // =========================
  // GET VIDEO
  // =========================

  const getVideo = async () => {
    try {
      const response = await axios.get(
        `${API}/videos/${videoId}`,
        {
          withCredentials: true,
        }
      );

      setVideo(response.data?.data || null);
    } catch (error) {
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

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

      setCurrentUser(response.data?.data || null);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  // =========================
  // GET COMMENTS
  // =========================

  const getComments = async () => {
    try {
      const response = await axios.get(
        `${API}/comments/getVideoComments/${videoId}`,
        {
          withCredentials: true,
        }
      );

      setComments(response.data?.data || []);
    } catch (error) {
      setComments([]);
    }
  };

  // =========================
  // GET LIKE INFO
  // =========================

  const getLikeInfo = async () => {
    try {
      const response = await axios.get(
        `${API}/likes/videoLikeInfo/${videoId}`,
        {
          withCredentials: true,
        }
      );

      setLikeCount(response.data?.data?.likeCount || 0);
      setIsLiked(response.data?.data?.isLiked || false);
    } catch (error) {
      setLikeCount(0);
      setIsLiked(false);
    }
  };

  // =========================
  // ADD TO WATCH HISTORY
  // =========================

  const addToHistory = async () => {
    try {
      await axios.post(
        `${API}/users/addToWatchHistory/${videoId}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      // History update failed
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    getVideo();
    getComments();
    getLikeInfo();
    getCurrentUser();
    addToHistory();
  }, [videoId]);

  // =========================
  // LIKE / UNLIKE
  // =========================

  const handleLike = async () => {
    try {
      await axios.post(
        `${API}/likes/likeVideo/${videoId}`,
        {},
        {
          withCredentials: true,
        }
      );

      await getLikeInfo();
    } catch (error) {
      // Like action failed
    }
  };

  // =========================
  // ADD COMMENT
  // =========================

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      await axios.post(
        `${API}/comments/addComment/${videoId}`,
        {
          content: commentText.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setCommentText("");

      await getComments();
    } catch (error) {
      // Comment action failed
    }
  };

  // =========================
  // DELETE COMMENT / REPLY
  // =========================

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${API}/comments/removeComment/${commentId}`,
        {
          withCredentials: true,
        }
      );

      await getComments();
    } catch (error) {
      // Delete action failed
    }
  };

  // =========================
  // START EDIT
  // =========================

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.content || "");
    setReplyingId(null);
    setReplyText("");
  };

  // =========================
  // UPDATE COMMENT / REPLY
  // =========================

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await axios.patch(
        `${API}/comments/updateComment/${commentId}`,
        {
          content: editText.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setEditingId(null);
      setEditText("");

      await getComments();
    } catch (error) {
      // Update action failed
    }
  };

  // =========================
  // REPLY
  // =========================

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      await axios.post(
        `${API}/comments/replyComment/${commentId}`,
        {
          content: replyText.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setReplyText("");
      setReplyingId(null);

      await getComments();
    } catch (error) {
      // Reply action failed
    }
  };

  // =========================
  // ID HELPER
  // =========================

  const getId = (value) => {
    if (!value) return null;

    if (typeof value === "object") {
      return value._id?.toString() || null;
    }

    return value.toString();
  };

  // =========================
  // COMMENT OWNER CHECK
  // =========================

  const isCommentOwner = (comment) => {
    const currentUserId = getId(currentUser?._id);

    const ownerId =
      getId(comment?.owner) ||
      getId(comment?.user) ||
      getId(comment?.userId);

    if (!currentUserId || !ownerId) {
      return false;
    }

    return currentUserId === ownerId;
  };

  // =========================
  // USER NAME
  // =========================

  const getUserName = (owner) => {
    if (!owner) return "User";

    if (typeof owner === "string") {
      return "User";
    }

    return (
      owner.fullname ||
      owner.username ||
      owner.userName ||
      "User"
    );
  };

  // =========================
  // USER INITIAL
  // =========================

  const getInitial = (owner) => {
    return (
      getUserName(owner).charAt(0).toUpperCase() || "U"
    );
  };

  // =========================
  // REPLY INPUT
  // =========================

  const renderReplyInput = (targetId, marginClass = "ml-10 sm:ml-12") => {
    if (replyingId !== targetId) {
      return null;
    }

    return (
      <div
        className={`mt-3 ${marginClass} flex flex-col sm:flex-row gap-2`}
      >
        <input
          type="text"
          placeholder="Write a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleReply(targetId);
            }
          }}
          className="
            flex-1
            px-4
            py-2.5
            bg-white
            border
            border-gray-200
            rounded-lg
            outline-none
            text-sm
            text-gray-900
            placeholder-gray-400
            focus:border-[#2563EB]
            focus:ring-2
            focus:ring-blue-100
          "
        />

        <button
          type="button"
          onClick={() => handleReply(targetId)}
          disabled={!replyText.trim()}
          className="
            px-4
            py-2.5
            bg-[#2563EB]
            text-white
            rounded-lg
            text-sm
            font-medium
            hover:bg-[#1D4ED8]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
          "
        >
          Reply
        </button>

        <button
          type="button"
          onClick={() => {
            setReplyingId(null);
            setReplyText("");
          }}
          className="
            px-4
            py-2.5
            bg-gray-100
            text-gray-700
            rounded-lg
            text-sm
            font-medium
            hover:bg-gray-200
            transition
          "
        >
          Cancel
        </button>
      </div>
    );
  };

  // =========================
  // RECURSIVE REPLY RENDERER
  // =========================

  const renderReplies = (replies, level = 0) => {
    if (!Array.isArray(replies) || replies.length === 0) {
      return null;
    }

    return (
      <div
        className={`
          mt-4
          ${level === 0 ? "ml-6 sm:ml-12" : "ml-4 sm:ml-8"}
          pl-4
          border-l-2
          border-blue-100
          space-y-3
        `}
      >
        {replies.map((reply) => (
          <div key={reply._id}>
            <div className="flex gap-3 bg-gray-50 rounded-xl px-4 py-3">

              {/* REPLY AVATAR */}
              {reply.owner?.avatar ? (
                <img
                  src={reply.owner.avatar}
                  alt={getUserName(reply.owner)}
                  className="
                    w-8
                    h-8
                    rounded-full
                    object-cover
                    flex-shrink-0
                  "
                />
              ) : (
                <div
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-blue-100
                    text-[#2563EB]
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >
                  <span className="text-xs font-semibold">
                    {getInitial(reply.owner)}
                  </span>
                </div>
              )}

              <div className="min-w-0 flex-1">

                {/* REPLY OWNER */}
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {getUserName(reply.owner)}
                  </p>

                  {reply.owner?.username && (
                    <p className="text-xs text-gray-400">
                      @{reply.owner.username}
                    </p>
                  )}
                </div>

                {/* EDIT REPLY */}
                {editingId === reply._id ? (
                  <div className="mt-2 flex flex-col gap-3">

                    <input
                      value={editText}
                      onChange={(e) =>
                        setEditText(e.target.value)
                      }
                      className="
                        w-full
                        px-4
                        py-2.5
                        bg-white
                        border
                        border-gray-200
                        rounded-lg
                        outline-none
                        text-sm
                        focus:border-[#2563EB]
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateComment(reply._id)
                        }
                        className="
                          px-4
                          py-2
                          bg-[#2563EB]
                          text-white
                          rounded-lg
                          text-sm
                          font-medium
                          hover:bg-[#1D4ED8]
                        "
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="
                          px-4
                          py-2
                          bg-gray-100
                          text-gray-700
                          rounded-lg
                          text-sm
                          font-medium
                          hover:bg-gray-200
                        "
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* REPLY CONTENT */}
                    <p className="text-sm text-gray-700 mt-1 break-words">
                      {reply.content}
                    </p>

                    {/* REPLY ACTIONS */}
                    <div className="flex items-center gap-4 mt-3">

                      {/* EDIT + DELETE ONLY OWNER */}
                      {isCommentOwner(reply) && (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(reply)}
                            className="
                              text-sm
                              font-medium
                              text-gray-500
                              hover:text-[#2563EB]
                              transition
                            "
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteComment(reply._id)
                            }
                            className="
                              text-sm
                              font-medium
                              text-gray-500
                              hover:text-red-600
                              transition
                            "
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {/* REPLY TO THIS REPLY */}
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingId(reply._id);
                          setReplyText("");
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="
                          text-sm
                          font-medium
                          text-gray-500
                          hover:text-[#2563EB]
                          transition
                        "
                      >
                        Reply
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* REPLY INPUT FOR THIS REPLY */}
            {renderReplyInput(
              reply._id,
              level === 0
                ? "ml-8 sm:ml-12"
                : "ml-6 sm:ml-10"
            )}

            {/* NESTED REPLIES */}
            {Array.isArray(reply.replies) &&
              reply.replies.length > 0 &&
              renderReplies(reply.replies, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="
              w-10
              h-10
              rounded-full
              border-4
              border-blue-100
              border-t-[#2563EB]
              animate-spin
            "
          />

          <p className="text-sm font-medium text-gray-500">
            Loading video...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // VIDEO NOT FOUND
  // =========================

  if (!video) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center max-w-md">

          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-full
              bg-blue-50
              flex
              items-center
              justify-center
            "
          >
            <svg
              className="w-9 h-9 text-[#2563EB]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 19h8a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Video not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The video may have been deleted or doesn't exist.
          </p>

          <Link
            to="/"
            className="
              inline-flex
              mt-6
              px-5
              py-2.5
              rounded-full
              bg-[#2563EB]
              text-white
              text-sm
              font-semibold
              hover:bg-[#1D4ED8]
              transition
            "
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <main className="min-h-screen bg-[#F8FAFC]">

      <div
        className="
          w-full
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
        "
      >

        {/* =========================
            VIDEO PLAYER
        ========================= */}

        <div
          className="
            w-full
            bg-black
            rounded-2xl
            overflow-hidden
            shadow-lg
          "
        >
          <video
            src={video.videoFile}
            controls
            autoPlay
            className="w-full aspect-video object-contain"
          />
        </div>

        {/* =========================
            VIDEO DETAILS
        ========================= */}

        <section className="mt-5">

          <h1
            className="
              text-2xl
              md:text-3xl
              font-bold
              text-gray-900
              leading-tight
            "
          >
            {video.title}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span>{video.views || 0} views</span>
          </div>

          {/* CHANNEL + LIKE */}

          <div
            className="
              mt-5
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
              pb-5
              border-b
              border-gray-200
            "
          >

            <Link
              to={`/channel/${video.owner?.username || ""}`}
              className="flex items-center gap-3 w-fit group"
            >
              {video.owner?.avatar ? (
                <img
                  src={video.owner.avatar}
                  alt={getUserName(video.owner)}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-blue-50
                    text-[#2563EB]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <span className="font-bold">
                    {getInitial(video.owner)}
                  </span>
                </div>
              )}

              <div>
                <h3
                  className="
                    font-semibold
                    text-gray-900
                    group-hover:text-[#2563EB]
                    transition
                  "
                >
                  {getUserName(video.owner)}
                </h3>

                {video.owner?.username && (
                  <p className="text-sm text-gray-500">
                    @{video.owner.username}
                  </p>
                )}
              </div>
            </Link>

            {/* LIKE */}

            <button
              type="button"
              onClick={handleLike}
              className={`
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-2.5
                rounded-full
                font-semibold
                text-sm
                transition
                ${
                  isLiked
                    ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "bg-blue-50 text-[#2563EB] hover:bg-blue-100"
                }
              `}
            >
              <svg
                className="w-5 h-5"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M7 10v10m0-10H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3m0-10 4.5-7A2 2 0 0 1 13 4.1V8h5.2a2 2 0 0 1 1.96 2.4l-1.33 7A2 2 0 0 1 16.87 19H7"
                />
              </svg>

              <span>{likeCount}</span>
            </button>
          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}

          <div
            className="
              mt-5
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-5
            "
          >
            <h2 className="font-semibold text-gray-900">
              Description
            </h2>

            <p
              className="
                mt-2
                text-sm
                sm:text-base
                text-gray-700
                leading-relaxed
                whitespace-pre-wrap
              "
            >
              {video.description || "No description available."}
            </p>
          </div>
        </section>

        {/* =========================
            COMMENTS
        ========================= */}

        <section
          className="
            mt-8
            bg-white
            border
            border-gray-200
            rounded-2xl
            p-5
            md:p-6
          "
        >

          {/* HEADER */}

          <div className="flex items-center gap-2 mb-6">

            <h2 className="text-xl font-bold text-gray-900">
              Comments
            </h2>

            <span
              className="
                px-2
                py-0.5
                rounded-full
                bg-blue-50
                text-[#2563EB]
                text-xs
                font-semibold
              "
            >
              {comments.length}
            </span>
          </div>

          {/* =========================
              ADD COMMENT
          ========================= */}

          <form
            onSubmit={handleAddComment}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              className="
                flex-1
                px-4
                py-3
                bg-gray-50
                border
                border-gray-200
                rounded-xl
                outline-none
                text-sm
                text-gray-900
                placeholder-gray-400
                focus:bg-white
                focus:border-[#2563EB]
                focus:ring-2
                focus:ring-blue-100
                transition
              "
            />

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="
                px-6
                py-3
                bg-[#2563EB]
                text-white
                rounded-xl
                font-semibold
                text-sm
                hover:bg-[#1D4ED8]
                active:scale-95
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              Comment
            </button>
          </form>

          {/* =========================
              COMMENT LIST
          ========================= */}

          <div className="space-y-6">

            {comments.length === 0 ? (
              <div className="py-12 text-center">

                <div
                  className="
                    w-14
                    h-14
                    mx-auto
                    rounded-full
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                  "
                >
                  <svg
                    className="w-6 h-6 text-[#2563EB]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                      d="M8 10h8M8 14h5m7-2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                    />
                  </svg>
                </div>

                <p className="mt-4 font-medium text-gray-700">
                  No comments yet
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Be the first to share your thoughts.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <article
                  key={comment._id}
                  className="
                    border-b
                    border-gray-100
                    pb-6
                    last:border-0
                  "
                >

                  {/* =========================
                      TOP LEVEL COMMENT
                  ========================= */}

                  <div className="flex gap-3">

                    {/* AVATAR */}

                    {comment.owner?.avatar ? (
                      <img
                        src={comment.owner.avatar}
                        alt={getUserName(comment.owner)}
                        className="
                          w-10
                          h-10
                          rounded-full
                          object-cover
                          flex-shrink-0
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-blue-50
                          text-[#2563EB]
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                        "
                      >
                        <span className="font-semibold text-sm">
                          {getInitial(comment.owner)}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">

                      {/* OWNER */}

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                          mb-1
                        "
                      >
                        <span className="font-semibold text-gray-900">
                          {getUserName(comment.owner)}
                        </span>

                        {comment.owner?.username && (
                          <span className="text-sm text-gray-400">
                            @{comment.owner.username}
                          </span>
                        )}
                      </div>

                      {/* EDIT COMMENT */}

                      {editingId === comment._id ? (
                        <div className="flex flex-col gap-3">

                          <input
                            value={editText}
                            onChange={(e) =>
                              setEditText(e.target.value)
                            }
                            className="
                              w-full
                              px-4
                              py-3
                              bg-gray-50
                              border
                              border-gray-200
                              rounded-xl
                              outline-none
                              text-sm
                              focus:bg-white
                              focus:border-[#2563EB]
                              focus:ring-2
                              focus:ring-blue-100
                            "
                          />

                          <div className="flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateComment(comment._id)
                              }
                              className="
                                px-4
                                py-2
                                bg-[#2563EB]
                                text-white
                                rounded-lg
                                text-sm
                                font-medium
                                hover:bg-[#1D4ED8]
                              "
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditText("");
                              }}
                              className="
                                px-4
                                py-2
                                bg-gray-100
                                text-gray-700
                                rounded-lg
                                text-sm
                                font-medium
                                hover:bg-gray-200
                              "
                            >
                              Cancel
                            </button>

                          </div>
                        </div>
                      ) : (
                        <>
                          {/* COMMENT TEXT */}

                          <p
                            className="
                              text-gray-700
                              leading-relaxed
                              break-words
                            "
                          >
                            {comment.content}
                          </p>

                          {/* COMMENT ACTIONS */}

                          <div className="flex items-center gap-4 mt-3">

                            {/* ONLY OWNER CAN EDIT/DELETE */}

                            {isCommentOwner(comment) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEdit(comment)
                                  }
                                  className="
                                    text-sm
                                    font-medium
                                    text-gray-500
                                    hover:text-[#2563EB]
                                    transition
                                  "
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteComment(
                                      comment._id
                                    )
                                  }
                                  className="
                                    text-sm
                                    font-medium
                                    text-gray-500
                                    hover:text-red-600
                                    transition
                                  "
                                >
                                  Delete
                                </button>
                              </>
                            )}

                            {/* REPLY */}

                            <button
                              type="button"
                              onClick={() => {
                                setReplyingId(comment._id);
                                setReplyText("");
                                setEditingId(null);
                                setEditText("");
                              }}
                              className="
                                text-sm
                                font-medium
                                text-gray-500
                                hover:text-[#2563EB]
                                transition
                              "
                            >
                              Reply
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* =========================
                      REPLY TO COMMENT INPUT
                  ========================= */}

                  {renderReplyInput(
                    comment._id,
                    "ml-10 sm:ml-12"
                  )}

                  {/* =========================
                      REPLIES
                  ========================= */}

                  {renderReplies(comment.replies)}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Watch;