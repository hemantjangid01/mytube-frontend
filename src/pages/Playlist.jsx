import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Playlist = () => {
  const navigate = useNavigate();


  const API = import.meta.env.VITE_API_URL;

  // =========================================================
  // STATE
  // =========================================================

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // All published videos available on the app
  const [allVideos, setAllVideos] = useState([]);

  const [selectedVideoId, setSelectedVideoId] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [playlistLoading, setPlaylistLoading] =
    useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // GET ALL USER PLAYLISTS
  // =========================================================

  const getPlaylists = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/playlists/getUserPlaylists`,
        {
          withCredentials: true,
        }
      );

      setPlaylists(response.data.data || []);
    } catch (error) {

      // A new user having zero playlists is NOT an error
      if (error.response?.status === 404) {
        setPlaylists([]);
        setError("");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load playlists"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET ALL PUBLISHED VIDEOS FROM APP
  // =========================================================

  const getAllVideos = async () => {
    try {
      setVideosLoading(true);

      const response = await axios.get(
        `${API}/videos`,
        {
          withCredentials: true,
        }
      );

      /*
        /videos is the public video feed.

        It should return published videos from the app.
        We DO NOT filter by owner here.
      */

      setAllVideos(response.data.data || []);
    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Failed to load videos"
      );
    } finally {
      setVideosLoading(false);
    }
  };

  // =========================================================
  // GET SINGLE VIDEO
  //
  // Used only if playlist API returns video IDs instead
  // of populated video objects.
  // =========================================================

  const getVideoDetails = async (videoId) => {
    try {
      const response = await axios.get(
        `${API}/videos/${videoId}`,
        {
          withCredentials: true,
        }
      );

      return response.data.data;
    } catch (error) {

      return null;
    }
  };

  // =========================================================
  // MAKE SURE PLAYLIST VIDEOS ARE FULL OBJECTS
  // =========================================================

  const loadPlaylistVideos = async (playlist) => {
    if (!playlist) return playlist;

    const videos = playlist.videos || [];

    if (videos.length === 0) {
      return {
        ...playlist,
        videos: [],
      };
    }

    const loadedVideos = await Promise.all(
      videos.map(async (video) => {
        // Already populated
        if (
          typeof video === "object" &&
          video !== null &&
          video._id
        ) {
          return video;
        }

        // Playlist contains only an ID
        const videoId =
          typeof video === "object"
            ? video._id || video.id
            : video;

        if (!videoId) {
          return null;
        }

        return await getVideoDetails(videoId);
      })
    );

    return {
      ...playlist,
      videos: loadedVideos.filter(Boolean),
    };
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    getPlaylists();
    getAllVideos();
  }, []);

  // =========================================================
  // CREATE PLAYLIST
  // =========================================================

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    if (!playlistName.trim()) {
      setError("Playlist name is required");
      return;
    }

    try {
      setError("");

      await axios.post(
        `${API}/playlists/createPlayList`,
        {
          name: playlistName.trim(),
          description: playlistDescription.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setPlaylistName("");
      setPlaylistDescription("");
      setShowCreateForm(false);

      await getPlaylists();
    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Failed to create playlist"
      );
    }
  };

  // =========================================================
  // OPEN PLAYLIST
  // =========================================================

  const openPlaylist = async (playlistId) => {
    try {
      setPlaylistLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/playlists/getPlayListById/${playlistId}`,
        {
          withCredentials: true,
        }
      );

      setSelectedPlaylist(playlistWithVideos);
      setSelectedVideoId("");
      setShowEditForm(false);

      setTimeout(() => {
        document
          .getElementById("selected-playlist")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Failed to open playlist"
      );
    } finally {
      setPlaylistLoading(false);
    }
  };

  // =========================================================
  // CLOSE PLAYLIST
  // =========================================================

  const closePlaylist = () => {
    setSelectedPlaylist(null);
    setSelectedVideoId("");
    setShowEditForm(false);
  };

  // =========================================================
  // ADD VIDEO TO PLAYLIST
  // =========================================================

  const handleAddVideo = async () => {
    if (!selectedPlaylist?._id) {
      setError("Open a playlist first");
      return;
    }

    if (!selectedVideoId) {
      setError("Select a video first");
      return;
    }

    try {
      setError("");

      setSelectedVideoId("");

      // Reload playlist
      await openPlaylist(selectedPlaylist._id);
    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Failed to add video"
      );
    }
  };

  // =========================================================
  // REMOVE VIDEO FROM PLAYLIST
  // =========================================================

  const handleRemoveVideo = async (videoId) => {
    if (!selectedPlaylist?._id) {
      setError("Missing playlist ID");
      return;
    }

    if (!videoId) {
      setError("Missing video ID");
      return;
    }

    try {
      setError("");

      await axios.delete(
        `${API}/playlists/removeVideoFromPlaylist/${selectedPlaylist._id}/${videoId}`,
        {
          withCredentials: true,
        }
      );

      await openPlaylist(selectedPlaylist._id);
    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Failed to remove video"
      );
    }
  };

  // =========================================================
  // DELETE PLAYLIST
  // =========================================================

  const handleDeletePlaylist = async (playlistId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this playlist?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await axios.delete(
        `${API}/playlists/deletePlayList/${playlistId}`,
        {
          withCredentials: true,
        }
      );

      setPlaylists((prev) =>
        prev.filter(
          (playlist) => playlist._id !== playlistId
        )
      );

      if (selectedPlaylist?._id === playlistId) {
        setSelectedPlaylist(null);
      }
    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Failed to delete playlist"
      );
    }
  };

  // =========================================================
  // START EDITING PLAYLIST
  // =========================================================

  const startEditingPlaylist = () => {
    if (!selectedPlaylist) return;

    setPlaylistName(selectedPlaylist.name || "");

    setPlaylistDescription(
      selectedPlaylist.description || ""
    );

    setShowEditForm(true);
    setError("");
  };

  // =========================================================
  // UPDATE PLAYLIST
  // =========================================================

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();

    if (!selectedPlaylist?._id) {
      return;
    }

    if (!playlistName.trim()) {
      setError("Playlist name is required");
      return;
    }

    try {
      setError("");

      const playlistId = selectedPlaylist._id;

      await axios.patch(
        `${API}/playlists/updatePlayList/${playlistId}`,
        {
          name: playlistName.trim(),
          description: playlistDescription.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setPlaylistName("");
      setPlaylistDescription("");
      setShowEditForm(false);

      await getPlaylists();
      await openPlaylist(playlistId);
    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Failed to update playlist"
      );
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Playlists
            </h1>

            <p className="text-[#64748B] mt-2">
              Create and manage your video playlists
            </p>
          </div>
        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            <p className="text-sm font-medium">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xl font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* ===================================================
            MY PLAYLISTS
        ==================================================== */}

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-[#0F172A]">
              My Playlists
            </h2>

            <span className="text-sm text-[#64748B]">
              {playlists.length}{" "}
              {playlists.length === 1
                ? "playlist"
                : "playlists"}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-44 rounded-2xl bg-white border border-[#E2E8F0] animate-pulse"
                />
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">
                📂
              </div>

              <h3 className="text-xl font-bold text-[#0F172A]">
                No playlists yet
              </h3>

              <p className="text-[#64748B] mt-2">
                Create your first playlist to organize
                your videos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="group bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-4">
                    📂
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A]">
                    {playlist.name}
                  </h3>

                  <p className="text-[#64748B] mt-2 line-clamp-2 min-h-[48px]">
                    {playlist.description ||
                      "No description"}
                  </p>

                  <div className="flex gap-3 mt-5">

                    <button
                      type="button"
                      onClick={() =>
                        openPlaylist(playlist._id)
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeletePlaylist(
                          playlist._id
                        )
                      }
                      className="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===================================================
            CREATE PLAYLIST BUTTON
        ==================================================== */}

        <div className="mt-8">
          {!showCreateForm && (
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(true);
                setError("");
              }}
              className="px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all duration-200"
            >
              + Create Playlist
            </button>
          )}
        </div>

        {/* ===================================================
            CREATE PLAYLIST FORM
        ==================================================== */}

        {showCreateForm && (
          <div className="mt-6 bg-white border border-[#E2E8F0] rounded-2xl p-6 max-w-xl shadow-sm">

            <div className="flex justify-between items-center mb-5">

              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">
                  Create Playlist
                </h2>

                <p className="text-sm text-[#64748B] mt-1">
                  Give your playlist a name and description.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setPlaylistName("");
                  setPlaylistDescription("");
                }}
                className="w-9 h-9 rounded-full hover:bg-slate-100 text-xl"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleCreatePlaylist}>

              <input
                type="text"
                value={playlistName}
                onChange={(e) =>
                  setPlaylistName(e.target.value)
                }
                placeholder="Playlist name"
                className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <textarea
                value={playlistDescription}
                onChange={(e) =>
                  setPlaylistDescription(
                    e.target.value
                  )
                }
                placeholder="Playlist description"
                rows="4"
                className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              />

              <div className="flex gap-3">

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8]"
                >
                  Create
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setPlaylistName("");
                    setPlaylistDescription("");
                  }}
                  className="px-5 py-3 rounded-xl border border-[#CBD5E1] font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* ===================================================
            SELECTED PLAYLIST
        ==================================================== */}

        {selectedPlaylist && (
          <section
            id="selected-playlist"
            className="mt-10 bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-7 shadow-sm shadow-slate-200/70"
          >

            {/* =================================================
                PLAYLIST HEADER
            ================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

              <div>

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                    📂
                  </div>

                  <div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                      {selectedPlaylist.name}
                    </h2>

                    <p className="text-sm text-[#64748B]">
                      {selectedPlaylist.videos?.length || 0}{" "}
                      videos
                    </p>

                  </div>

                </div>

                <p className="text-[#64748B] mt-4 max-w-2xl">
                  {selectedPlaylist.description ||
                    "No description"}
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={startEditingPlaylist}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] font-semibold hover:bg-slate-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={closePlaylist}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] font-semibold hover:bg-slate-50"
                >
                  Close
                </button>

              </div>

            </div>

            {/* =================================================
                EDIT FORM
            ================================================== */}

            {showEditForm && (
              <form
                onSubmit={handleUpdatePlaylist}
                className="mt-6 bg-gray-50 border border-[#E2E8F0] rounded-2xl p-5"
              >

                <h3 className="text-xl font-bold mb-4">
                  Edit Playlist
                </h3>

                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) =>
                    setPlaylistName(e.target.value)
                  }
                  placeholder="Playlist name"
                  className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 mb-4 bg-white outline-none focus:border-blue-500"
                />

                <textarea
                  value={playlistDescription}
                  onChange={(e) =>
                    setPlaylistDescription(
                      e.target.value
                    )
                  }
                  placeholder="Playlist description"
                  rows="3"
                  className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 mb-4 bg-white outline-none focus:border-blue-500 resize-none"
                />

                <div className="flex gap-3">

                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8]"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowEditForm(false)
                    }
                    className="px-5 py-3 rounded-xl border border-[#CBD5E1] font-semibold hover:bg-white"
                  >
                    Cancel
                  </button>

                </div>

              </form>
            )}

            {/* =================================================
                ADD VIDEO
            ================================================== */}

            <div className="mt-10">

              <div className="mb-5">

                <h3 className="text-xl font-bold text-[#0F172A]">
                  Add Video
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Choose any published video from the app.
                </p>

              </div>

              {videosLoading ? (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-64 rounded-2xl bg-slate-100 animate-pulse"
                    />
                  ))}

                </div>

              ) : allVideos.length === 0 ? (

                <div className="rounded-xl border border-[#E2E8F0] bg-gray-50 p-6 text-center">
                  <p className="text-[#64748B]">
                    No published videos are available.
                  </p>
                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {allVideos.map((video) => {

                    const isSelected =
                      selectedVideoId === video._id;

                    return (
                      <div
                        key={video._id}
                        onClick={() =>
                          setSelectedVideoId(video._id)
                        }
                        className={`bg-white border-2 rounded-2xl overflow-hidden cursor-pointer transition ${
                          isSelected
                            ? "border-[#2563EB] shadow-md"
                            : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                        }`}
                      >

                        <div className="relative">

                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full aspect-video object-cover"
                          />

                          {isSelected && (
                            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold">
                              ✓
                            </div>
                          )}

                        </div>

                        <div className="p-4">

                          <h4 className="font-bold text-[#0F172A] line-clamp-2">
                            {video.title ||
                              "Untitled video"}
                          </h4>

                          <p className="text-sm text-[#64748B] mt-2 line-clamp-2">
                            {video.description ||
                              "No description"}
                          </p>

                          {video.views !== undefined && (
                            <p className="text-xs text-[#94A3B8] mt-2">
                              {video.views} views
                            </p>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

              <button
                type="button"
                onClick={handleAddVideo}
                disabled={!selectedVideoId}
                className="mt-5 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Selected Video
              </button>

            </div>

            {/* =================================================
                PLAYLIST VIDEOS
            ================================================== */}

            <div className="mt-12">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    Playlist Videos
                  </h3>

                  <p className="text-sm text-[#64748B] mt-1">
                    Videos currently inside this playlist.
                  </p>
                </div>

                <span className="text-sm text-[#64748B]">
                  {selectedPlaylist.videos?.length || 0}{" "}
                  videos
                </span>

              </div>

              {playlistLoading ? (

                <div className="py-10 text-center">

                  <div className="inline-block w-8 h-8 border-4 border-[#E2E8F0] border-t-blue-600 rounded-full animate-spin" />

                  <p className="text-[#64748B] mt-3">
                    Loading playlist...
                  </p>

                </div>

              ) : !selectedPlaylist.videos ||
                selectedPlaylist.videos.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-gray-50 p-10 text-center">

                  <div className="text-5xl mb-4">
                    🎬
                  </div>

                  <h4 className="text-lg font-bold text-[#0F172A]">
                    No videos in this playlist
                  </h4>

                  <p className="text-[#64748B] mt-2">
                    Select any published video above and
                    add it to this playlist.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {selectedPlaylist.videos.map(
                    (video, index) => {

                      if (!video || !video._id) {
                        return null;
                      }

                      return (
                        <div
                          key={video._id || index}
                          className="group flex flex-col sm:flex-row gap-4 border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 hover:border-[#CBD5E1] hover:shadow-sm transition"
                        >

                          {/* THUMBNAIL */}

                          <div
                            onClick={() =>
                              navigate(
                                `/watch/${video._id}`
                              )
                            }
                            className="relative flex-shrink-0 cursor-pointer"
                          >

                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full sm:w-48 h-28 object-cover rounded-xl"
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">

                              <div className="w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center">
                                ▶
                              </div>

                            </div>

                          </div>

                          {/* VIDEO INFO */}

                          <div
                            onClick={() =>
                              navigate(
                                `/watch/${video._id}`
                              )
                            }
                            className="flex-1 min-w-0 cursor-pointer"
                          >

                            <h4 className="font-bold text-lg text-[#0F172A] line-clamp-2">
                              {video.title ||
                                "Untitled video"}
                            </h4>

                            <p className="text-sm text-[#64748B] mt-2 line-clamp-2">
                              {video.description ||
                                "No description"}
                            </p>

                            {video.views !== undefined && (
                              <p className="text-xs text-[#94A3B8] mt-2">
                                {video.views} views
                              </p>
                            )}

                          </div>

                          {/* REMOVE */}

                          <div className="flex sm:items-center">

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                handleRemoveVideo(
                                  video._id
                                );
                              }}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition"
                            >
                              Remove
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </section>
        )}

      </div>
    </div>
  );
};

export default Playlist;