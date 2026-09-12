import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Watch = () => {
  const { videoId } = useParams();

  const API = import.meta.env.VITE_API_URL;

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [loading, setLoading] = useState(true);

  // =========================================================
  // GET VIDEO
  // =========================================================

  const getVideo = async () => {
    try {
      const response = await axios.get(
        `${API}/videos/${videoId}`,
        {
          withCredentials: true,
        }
      );

      setVideo(response.data.data);
    } catch (error) {
      console.log(
        "Error fetching video:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET COMMENTS
  // =========================================================

  const getComments = async () => {
    try {
      const response = await axios.get(
        `${API}/comments/getVideoComments/${videoId}`,
        {
          withCredentials: true,
        }
      );

      setComments(response.data.data || []);
      console.log(response);
    } catch (error) {
      console.log(
        "Error fetching comments:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // GET LIKE INFO
  // =========================================================

  const getLikeInfo = async () => {
    try {
      const response = await axios.get(
        `${API}/likes/videoLikeInfo/${videoId}`,
        {
          withCredentials: true,
        }
      );

      setLikeCount(response.data.data.likeCount);
      setIsLiked(response.data.data.isLiked);
    } catch (error) {
      console.log(
        "Error fetching like info:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // ADD TO WATCH HISTORY
  // =========================================================

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
      console.log(
        "Error adding to history:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    getVideo();
    getComments();
    getLikeInfo();
    addToHistory();
  }, [videoId]);

  // =========================================================
  // LIKE / UNLIKE
  // =========================================================

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
      console.log(
        "Error liking video:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // ADD COMMENT
  // =========================================================

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `${API}/comments/addComment/${videoId}`,
        {
          content: commentText.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setComments((prev) => [
        response.data.data,
        ...prev,
      ]);

      setCommentText("");
      

      // Reload so populated owner information is displayed
      await getComments();
    } catch (error) {
      console.log(
        "Error adding comment:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // DELETE COMMENT
  // =========================================================

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${API}/comments/removeComment/${commentId}`,
        {
          withCredentials: true,
        }
      );

      setComments((prev) =>
        prev.filter(
          (comment) => comment._id !== commentId
        )
      );
    } catch (error) {
      console.log(
        "Error deleting comment:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // START EDIT
  // =========================================================

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.content);
  };

  // =========================================================
  // UPDATE COMMENT
  // =========================================================

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
      console.log(
        "Error updating comment:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // REPLY
  // =========================================================

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
      console.log(
        "Error replying:",
        error.response?.data || error.message
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">
            Loading video...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIDEO NOT FOUND
  // =========================================================

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Video not found
          </h1>

          <p className="text-gray-500 mt-2">
            The video may have been deleted or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // HELPERS
  // =========================================================

  const getUserName = (owner) => {
    return (
      owner?.fullname ||
      owner?.username ||
      owner?.userName ||
      "User"
    );
  };

  const getInitial = (owner) => {
    return getUserName(owner)[0]?.toUpperCase() || "U";
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ===================================================
            VIDEO
        ==================================================== */}

        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-lg">
          <video
            src={video.videoFile}
            controls
            autoPlay
            className="w-full aspect-video object-contain"
          />
        </div>

        {/* ===================================================
            VIDEO INFO
        ==================================================== */}

        <section className="mt-5">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {video.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {video.views || 0} views
          </p>

          {/* CHANNEL + LIKE */}

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">

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
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">
                    {getInitial(video.owner)}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 group-hover:underline">
                  {getUserName(video.owner)}
                </h3>

                {video.owner?.username && (
                  <p className="text-sm text-gray-500">
                    @{video.owner.username}
                  </p>
                )}
              </div>

            </Link>

            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium transition ${
                isLiked
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">
                {isLiked ? "♥" : "♡"}
              </span>

              <span>{likeCount}</span>
            </button>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-5 bg-white border border-gray-200 rounded-xl p-5">

            <h2 className="font-semibold text-gray-900 mb-2">
              Description
            </h2>

            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {video.description ||
                "No description available."}
            </p>

          </div>

        </section>

        {/* ===================================================
            COMMENTS
        ==================================================== */}

        <section className="mt-8 bg-white border border-gray-200 rounded-xl p-5 md:p-6">

          <div className="flex items-center gap-2 mb-6">

            <h2 className="text-xl font-bold text-gray-900">
              Comments
            </h2>

            <span className="text-sm text-gray-500">
              ({comments.length})
            </span>

          </div>

          {/* ADD COMMENT */}

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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black"
            />

            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
            >
              Comment
            </button>

          </form>

          {/* COMMENT LIST */}

          <div className="space-y-6">

            {comments.length === 0 ? (

              <div className="py-10 text-center">
                <p className="text-gray-400">
                  No comments yet.
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Be the first to comment.
                </p>
              </div>

            ) : (

              comments.map((comment) => (

                <div
                  key={comment._id}
                  className="border-b border-gray-100 pb-6 last:border-0"
                >

                  {/* =================================================
                      COMMENT
                  ================================================== */}

                  <div className="flex gap-3">

                    {/* AVATAR */}

                    {comment.owner?.avatar ? (

                      <img
                        src={comment.owner.avatar}
                        alt={getUserName(comment.owner)}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />

                    ) : (

                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-gray-600">
                          {getInitial(comment.owner)}
                        </span>
                      </div>

                    )}

                    <div className="flex-1 min-w-0">

                      {/* OWNER */}

                      <div className="flex flex-wrap items-center gap-2 mb-1">

                        <span className="font-semibold text-gray-900">
                          {getUserName(comment.owner)}
                        </span>

                        {comment.owner?.username && (
                          <span className="text-sm text-gray-400">
                            @{comment.owner.username}
                          </span>
                        )}

                      </div>

                      {/* COMMENT TEXT */}

                      {editingId === comment._id ? (

                        <div className="flex flex-col gap-3">

                          <input
                            value={editText}
                            onChange={(e) =>
                              setEditText(e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-black"
                          />

                          <div className="flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateComment(
                                  comment._id
                                )
                              }
                              className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditText("");
                              }}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      ) : (

                        <>

                          <p className="text-gray-800 leading-relaxed">
                            {comment.content}
                          </p>

                          {/* ACTIONS */}

                          <div className="flex items-center gap-4 mt-3">

                            <button
                              type="button"
                              onClick={() =>
                                startEdit(comment)
                              }
                              className="text-sm text-gray-500 hover:text-black"
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
                              className="text-sm text-gray-500 hover:text-red-600"
                            >
                              Delete
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setReplyingId(
                                  comment._id
                                );
                                setReplyText("");
                              }}
                              className="text-sm text-gray-500 hover:text-black"
                            >
                              Reply
                            </button>

                          </div>

                        </>
                      )}

                    </div>

                  </div>

                  {/* =================================================
                      REPLY INPUT
                  ================================================== */}

                  {replyingId === comment._id && (
                    <div className="mt-4 ml-12 flex flex-col sm:flex-row gap-2">

                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) =>
                          setReplyText(e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-black"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleReply(comment._id)
                        }
                        className="px-4 py-2.5 bg-black text-white rounded-lg text-sm"
                      >
                        Reply
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText("");
                        }}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        Cancel
                      </button>

                    </div>
                  )}

                  {/* =================================================
                      REPLIES
                  ================================================== */}

                  {comment.replies?.length > 0 && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-gray-200 space-y-3">

                      {comment.replies.map((reply) => (

                        <div
                          key={reply._id}
                          className="flex gap-3 bg-gray-50 rounded-lg px-4 py-3"
                        >

                          {reply.owner?.avatar ? (

                            <img
                              src={reply.owner.avatar}
                              alt={getUserName(reply.owner)}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />

                          ) : (

                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-gray-600">
                                {getInitial(reply.owner)}
                              </span>
                            </div>

                          )}

                          <div>

                            <p className="text-sm font-semibold text-gray-800">
                              {getUserName(reply.owner)}
                            </p>

                            {reply.owner?.username && (
                              <p className="text-xs text-gray-400">
                                @{reply.owner.username}
                              </p>
                            )}

                            <p className="text-sm text-gray-700 mt-1">
                              {reply.content}
                            </p>

                          </div>

                        </div>

                      ))}

                    </div>
                  )}

                </div>

              ))

            )}

          </div>

        </section>

      </main>
    </div>
  );
};

export default Watch;