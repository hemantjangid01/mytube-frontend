import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    const API = import.meta.env.VITE_API_URL;
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
    username: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverimage, setCoverimage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE SIGNUP
  // =========================

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !signupData.fullname.trim() ||
      !signupData.email.trim() ||
      !signupData.password.trim() ||
      !signupData.username.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("fullname", signupData.fullname.trim());
      data.append("email", signupData.email.trim());
      data.append("password", signupData.password);
      data.append("username", signupData.username.trim());

      if (avatar) {
        data.append("avatar", avatar);
      }

      if (coverimage) {
        data.append("coverimage", coverimage);
      }

      const response = await axios.post(
        `${API}/users/register`,
        data,
        {
          withCredentials: true,
        }
      );

      console.log("SIGNUP RESPONSE:", response.data);

      navigate("/login");
    } catch (error) {
      console.error(
        "Signup error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

      {/* =========================
          SIGNUP CARD
      ========================= */}

      <div className="w-full max-w-lg">

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-7 sm:p-9">

          {/* =========================
              HEADER
          ========================= */}

          <div className="text-center mb-7">

            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">

              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
              </svg>

            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Create your account
            </h1>

            <p className="mt-2 text-gray-500 text-sm">
              Join the community and start watching
            </p>

          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* =========================
              FORM
          ========================= */}

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >

            {/* Full Name */}

            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>

              <input
                id="fullname"
                name="fullname"
                type="text"
                value={signupData.fullname}
                placeholder="Enter your full name"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={signupData.email}
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Username */}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={signupData.username}
                placeholder="Choose a username"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={signupData.password}
                placeholder="Create a password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* =========================
                AVATAR
            ========================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>

              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">

                {avatar ? (
                  <div className="flex items-center gap-3">

                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Avatar preview"
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <span className="text-sm text-gray-600">
                      {avatar.name}
                    </span>

                  </div>
                ) : (
                  <div className="text-center">

                    <p className="text-sm font-medium text-gray-600">
                      Choose profile picture
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG or JPEG
                    </p>

                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setAvatar(e.target.files[0] || null)
                  }
                />

              </label>
            </div>

            {/* =========================
                COVER IMAGE
            ========================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>

              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden">

                {coverimage ? (
                  <div className="flex items-center gap-3">

                    <img
                      src={URL.createObjectURL(coverimage)}
                      alt="Cover preview"
                      className="h-16 w-28 rounded-lg object-cover"
                    />

                    <span className="text-sm text-gray-600">
                      {coverimage.name}
                    </span>

                  </div>
                ) : (
                  <div className="text-center">

                    <p className="text-sm font-medium text-gray-600">
                      Choose cover image
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG or JPEG
                    </p>

                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setCoverimage(e.target.files[0] || null)
                  }
                />

              </label>
            </div>

            {/* =========================
                SIGNUP BUTTON
            ========================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold transition hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          {/* =========================
              LOGIN
          ========================= */}

          <div className="mt-7 text-center text-sm text-gray-500">

            <span>Already have an account? </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-red-600 hover:text-red-700"
            >
              Login
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}