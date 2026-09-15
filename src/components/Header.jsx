import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const API = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${API}/users/current-user`,
          {
            withCredentials: true,
          }
        );

        setUser(response.data?.data || null);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    getCurrentUser();
  }, [API]);

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
      window.location.replace("/login");
    } catch (error) {
      // Logout failed
    }
  };

  const userInitial =
    user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white border-b border-gray-200">
      <div className="h-full flex items-center px-4 sm:px-6 lg:px-8 gap-4">

        {/* =========================
            LOGO
        ========================= */}

        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to MyTube home"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          {/* Logo */}
          <div
            className="
              w-9
              h-9
              rounded-lg
              bg-[#2563EB]
              flex
              items-center
              justify-center
              transition
              group-hover:bg-[#1D4ED8]
            "
          >
            <svg
              className="w-4.5 h-4.5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5.5v13l10-6.5-10-6.5Z" />
            </svg>
          </div>

          <span
            className="
              hidden
              sm:block
              text-xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            MyTube
          </span>
        </button>

        {/* =========================
            SEARCH
        ========================= */}

        <form
          onSubmit={handleSearch}
          className="flex-1 flex justify-center"
        >
          <div
            className="
              flex
              w-full
              max-w-2xl
              h-10
              bg-gray-50
              border
              border-gray-200
              rounded-lg
              overflow-hidden
              focus-within:bg-white
              focus-within:border-gray-300
              focus-within:ring-2
              focus-within:ring-blue-50
              transition
            "
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos"
              aria-label="Search videos"
              className="
                flex-1
                min-w-0
                px-4
                bg-transparent
                text-sm
                text-gray-900
                placeholder-gray-400
                outline-none
              "
            />

            <button
              type="submit"
              aria-label="Search"
              className="
                w-11
                shrink-0
                flex
                items-center
                justify-center
                text-gray-500
                hover:text-gray-900
                hover:bg-gray-100
                transition
              "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="flex items-center gap-2 shrink-0">

          {authLoading ? (
            <div className="w-20 h-9 rounded-lg bg-gray-100 animate-pulse" />
          ) : user ? (
            <>
              {/* PROFILE */}

              <button
                type="button"
                onClick={() => navigate("/edit-profile")}
                aria-label="Open profile"
                className="
                  flex
                  items-center
                  gap-2
                  px-2
                  py-1.5
                  rounded-lg
                  hover:bg-gray-100
                  transition
                "
              >
                <div
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-blue-50
                    text-[#2563EB]
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold
                  "
                >
                  {userInitial}
                </div>

                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.username || "Profile"}
                </span>
              </button>

              {/* DIVIDER */}

              <div className="hidden sm:block w-px h-6 bg-gray-200" />

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  px-3
                  py-2
                  rounded-lg
                  text-sm
                  font-medium
                  text-gray-600
                  hover:text-gray-900
                  hover:bg-gray-100
                  transition
                "
              >
                Logout
              </button>
            </>
          ) : (
            /* LOGIN */

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                px-4
                py-2
                rounded-lg
                bg-[#2563EB]
                text-white
                text-sm
                font-semibold
                hover:bg-[#1D4ED8]
                transition
              "
            >
              Login
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;