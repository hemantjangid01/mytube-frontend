
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

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

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

      await axios.post(`${API}/users/register`, data, {
        withCredentials: true,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">

        {/* Signup Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-slate-200/60 p-7 sm:p-9">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-200">
              <svg
                className="w-7 h-7 text-white ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Create your account
            </h1>

            <p className="mt-2 text-[#64748B] text-sm">
              Join the community and start watching
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
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
                autoComplete="name"
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-[#CBD5E1]
                  bg-white text-[#0F172A]
                  placeholder-[#94A3B8]
                  outline-none transition-all
                  focus:border-[#2563EB]
                  focus:ring-4 focus:ring-blue-100
                "
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
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
                autoComplete="email"
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-[#CBD5E1]
                  bg-white text-[#0F172A]
                  placeholder-[#94A3B8]
                  outline-none transition-all
                  focus:border-[#2563EB]
                  focus:ring-4 focus:ring-blue-100
                "
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
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
                autoComplete="username"
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-[#CBD5E1]
                  bg-white text-[#0F172A]
                  placeholder-[#94A3B8]
                  outline-none transition-all
                  focus:border-[#2563EB]
                  focus:ring-4 focus:ring-blue-100
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
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
                autoComplete="new-password"
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-[#CBD5E1]
                  bg-white text-[#0F172A]
                  placeholder-[#94A3B8]
                  outline-none transition-all
                  focus:border-[#2563EB]
                  focus:ring-4 focus:ring-blue-100
                "
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Profile Picture
              </label>

              <label
                className="
                  flex items-center justify-center
                  w-full min-h-24 px-4
                  border-2 border-dashed border-[#CBD5E1]
                  rounded-xl cursor-pointer
                  bg-slate-50
                  hover:bg-blue-50 hover:border-blue-300
                  transition-all
                  overflow-hidden
                "
              >
                {avatar ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Avatar preview"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100"
                    />

                    <span className="text-sm font-medium text-[#64748B] truncate max-w-[220px]">
                      {avatar.name}
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-2 w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center">
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
                          d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 7a7 7 0 0 1 14 0"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-semibold text-[#64748B]">
                      Choose profile picture
                    </p>

                    <p className="text-xs text-[#94A3B8] mt-1">
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

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Cover Image
              </label>

              <label
                className="
                  flex items-center justify-center
                  w-full min-h-24 px-4
                  border-2 border-dashed border-[#CBD5E1]
                  rounded-xl cursor-pointer
                  bg-slate-50
                  hover:bg-blue-50 hover:border-blue-300
                  transition-all
                  overflow-hidden
                "
              >
                {coverimage ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(coverimage)}
                      alt="Cover preview"
                      className="h-16 w-28 rounded-lg object-cover ring-2 ring-blue-100"
                    />

                    <span className="text-sm font-medium text-[#64748B] truncate max-w-[220px]">
                      {coverimage.name}
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-2 w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center">
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
                          d="M4 16l4.5-5 3.5 4 2.5-3 5.5 6M5 20h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1Z"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-semibold text-[#64748B]">
                      Choose cover image
                    </p>

                    <p className="text-xs text-[#94A3B8] mt-1">
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

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl
                bg-[#2563EB] text-white
                font-semibold
                shadow-sm
                hover:bg-[#1D4ED8]
                hover:shadow-md
                active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-7 pt-6 border-t border-[#E2E8F0] text-center text-sm">
            <span className="text-[#64748B]">
              Already have an account?{" "}
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                font-semibold
                text-[#2563EB]
                hover:text-[#1D4ED8]
                transition-colors
              "
            >
              Login
            </button>
          </div>
        </div>

        {/* Brand */}
        <p className="text-center text-xs text-[#94A3B8] mt-5">
          MyTube · Your video community
        </p>

      </div>
    </div>
  );
}
