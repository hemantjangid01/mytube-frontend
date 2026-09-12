
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
      setCurrentCoverImage(user.coverimage || "");
    } catch (error) {
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
  // UPDATE COVER IMAGE
  // =========================
  const updateCoverImage = async () => {
    if (!coverImage) return;

    const formData = new FormData();
    formData.append("coverImage", coverImage);

    await axios.patch(`${API}/users/cover-image`, formData, {
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
      setCoverImage(null);
    } catch (error) {
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin" />

          <p className="text-sm text-[#64748B]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            Edit Profile
          </h1>

          <p className="text-[#64748B] mt-2">
            Update your account information and profile appearance.
          </p>
        </div>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
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

        {/* =========================
            PROFILE CARD
        ========================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden"
        >

          {/* =========================
              COVER
          ========================= */}
          <div className="relative">

            <div className="h-48 sm:h-56 bg-slate-100 overflow-hidden">
              {currentCoverImage ? (
                <img
                  src={currentCoverImage}
                  alt="Current cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#2563EB] flex items-center justify-center shadow-sm">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2Z"
                      />
                    </svg>
                  </div>

                  <span className="mt-2 text-sm text-[#64748B]">
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
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-lg flex items-center justify-center text-[#2563EB]">
                  <svg
                    className="w-9 h-9"
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
            </div>
          </div>

          {/* =========================
              ACCOUNT INFORMATION
          ========================= */}
          <div className="px-6 sm:px-8 pt-20 pb-8 space-y-7">

            <div className="flex items-start gap-3">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0ZM4 21a8 8 0 0116 0"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  Account Information
                </h2>

                <p className="text-sm text-[#64748B] mt-1">
                  Change your basic account details.
                </p>
              </div>
            </div>

            {/* FULL NAME */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Full Name
              </label>

              <input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your full name"
                required
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
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
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
            </div>

            {/* =========================
                AVATAR
            ========================= */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Profile Picture
              </label>

              <label className="
                flex items-center gap-4
                p-4
                border-2 border-dashed border-[#CBD5E1]
                rounded-xl
                cursor-pointer
                bg-[#F8FAFC]
                hover:bg-blue-50
                hover:border-[#2563EB]
                transition
              ">
                <div className="w-12 h-12 shrink-0 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
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

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">
                    {avatar
                      ? avatar.name
                      : "Choose a new profile picture"}
                  </p>

                  <p className="text-xs text-[#94A3B8] mt-1">
                    Select an image from your computer
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setAvatar(e.target.files[0] || null)
                  }
                />
              </label>

              {/* NEW AVATAR PREVIEW */}
              {avatar && (
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="New avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      New profile picture
                    </p>

                    <p className="text-xs text-[#64748B] mt-1">
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
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Cover Image
              </label>

              <label className="
                flex items-center gap-4
                p-4
                border-2 border-dashed border-[#CBD5E1]
                rounded-xl
                cursor-pointer
                bg-[#F8FAFC]
                hover:bg-blue-50
                hover:border-[#2563EB]
                transition
              ">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
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

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">
                    {coverImage
                      ? coverImage.name
                      : "Choose a new cover image"}
                  </p>

                  <p className="text-xs text-[#94A3B8] mt-1">
                    Select an image from your computer
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setCoverImage(e.target.files[0] || null)
                  }
                />
              </label>

              {/* NEW COVER PREVIEW */}
              {coverImage && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-[#0F172A] mb-2">
                    New cover preview
                  </p>

                  <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-100">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="New cover"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =========================
              FOOTER
          ========================= */}
          <div className="
            px-6 sm:px-8 py-5
            bg-[#F8FAFC]
            border-t border-[#E2E8F0]
            flex flex-col-reverse
            sm:flex-row sm:justify-end
            gap-3
          ">
            <button
              type="button"
              disabled={saving}
              onClick={() => window.history.back()}
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
              disabled={saving}
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
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;
