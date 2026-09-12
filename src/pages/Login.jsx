
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const API = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API}/users/login`,
        {
          email: email.trim(),
          password,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl shadow-slate-200/60 p-7 sm:p-9">

          {/* Logo / Heading */}
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
              Welcome back
            </h1>

            <p className="text-[#64748B] mt-2">
              Login in to continue to MyTube
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
          <form onSubmit={handleLogin} className="space-y-5">

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
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

            {/* Login Button */}
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
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Signup */}
          <div className="mt-7 pt-6 border-t border-[#E2E8F0] text-center text-sm">
            <span className="text-[#64748B]">
              Don't have an account?{" "}
            </span>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="
                font-semibold
                text-[#2563EB]
                hover:text-[#1D4ED8]
                transition-colors
              "
            >
              Sign up
            </button>
          </div>

        </div>

        {/* Small Brand Text */}
        <p className="text-center text-xs text-[#94A3B8] mt-5">
          MyTube · Your video community
        </p>

      </div>
    </div>
  );
}
