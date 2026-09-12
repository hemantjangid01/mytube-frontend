import React, { useEffect, useState } from "react";
import axios from "axios";

const EditProfile = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [currentAvatar, setCurrentAvatar] = useState("");
  const [currentCoverImage, setCurrentCoverImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL;

  // =========================
  // GET CURRENT USER
  // =========================
  const getCurrentUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API}/users/current-user`, {
        withCredentials: true,
      });

      const user = response.data.data;

      setFullname(user.fullname || "");
      setEmail(user.email || "");

      setCurrentAvatar(user.avatar || "");
      setCurrentCoverImage(user.coverImage || "");
    } catch (error) {
      console.log("Error fetching user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // =========================
  // UPDATE NAME + EMAIL
  // =========================
  const updateAccount = async () => {
    await axios.patch(
      `${API}/users/update-account`,
      {
        fullname: fullname.trim(),
        email: email.trim(),
      },
      {
        withCredentials: true,
      }
    );
  };

  // =========================
  // UPDATE AVATAR
  // =========================
  const updateAvatar = async () => {
    if (!avatar) return;

    const formData = new FormData();

    formData.append("avatar", avatar);

    await axios.patch(`${API}/users/avatar`, formData, {
      withCredentials: true,
    });
  };

  // =========================
  // SAVE EVERYTHING
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!fullname.trim()) {
      setError("Full name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setSaving(true);

      await updateAccount();

      if (avatar) {
  await updateAvatar();
}

if (coverImage) {
  await updateCoverImage();
}

      await getCurrentUser();

      setAvatar(null);

      alert("Profile updated successfully");
    } catch (error) {
      console.log(
        "Profile update error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
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

          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }
  const updateCoverImage = async () => {
  if (!coverImage) return;

  const formData = new FormData();
  formData.append("coverImage", coverImage);

  await axios.patch(`${API}/users/cover-image`, formData, {
    withCredentials: true,
  });
};

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Edit Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Update your account information and profile appearance.
          </p>
        </div>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* =========================
            PROFILE CARD
        ========================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >

          {/* =========================
              COVER
          ========================= */}
          <div className="relative">

            <div className="h-48 sm:h-56 bg-gray-200 overflow-hidden">
              {currentCoverImage ? (
                <img
                  src={currentCoverImage}
                  alt="Current cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">
                    No cover image
                  </span>
                </div>
              )}
            </div>

            {/* AVATAR */}
            <div className="absolute left-6 sm:left-8 -bottom-12">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    👤
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* =========================
              ACCOUNT INFORMATION
          ========================= */}
          <div className="px-6 sm:px-8 pt-20 pb-8 space-y-7">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Account Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Change your basic account details.
              </p>
            </div>

            {/* FULL NAME */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Full Name
              </label>

              <input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) =>
                  setFullname(e.target.value)
                }
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition"
              />
            </div>

            {/* =========================
                AVATAR
            ========================= */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Profile Picture
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition">

                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                  🖼️
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {avatar
                      ? avatar.name
                      : "Choose a new profile picture"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Select an image from your computer
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setAvatar(
                      e.target.files[0] || null
                    )
                  }
                />

              </label>

              {/* NEW AVATAR PREVIEW */}
              {avatar && (
                <div className="mt-4 flex items-center gap-3">

                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="New avatar"
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      New profile picture
                    </p>

                    <p className="text-xs text-gray-500">
                      This will replace your current picture.
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* =========================
                COVER IMAGE
            ========================= */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cover Image
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition">

                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                  🖼️
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {coverImage
                      ? coverImage.name
                      : "Choose a new cover image"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Select an image from your computer
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setCoverImage(
                      e.target.files[0] || null
                    )
                  }
                />

              </label>

              {/* NEW COVER PREVIEW */}
              {coverImage && (
                <div className="mt-4">

                  <p className="text-sm font-medium text-gray-800 mb-2">
                    New cover preview
                  </p>

                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="New cover"
                    className="w-full h-40 object-cover rounded-xl border border-gray-200"
                  />

                </div>
              )}
            </div>

          </div>

          {/* =========================
              FOOTER
          ========================= */}
          <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

            <button
              type="button"
              disabled={saving}
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
};

export default EditProfile;