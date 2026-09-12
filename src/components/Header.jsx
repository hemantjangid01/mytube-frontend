
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const API = import.meta.env.VITE_API_URL;

  // =========================
  // AUTH STATE
  // =========================

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // =========================
  // SEARCH STATE
  // =========================

  const [search, setSearch] = useState("");

  // =========================
  // SYNC SEARCH WITH URL
  // =========================

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  // =========================
  // GET CURRENT USER
  // =========================

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

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
  };

  // =========================
  // LOGOUT
  // =========================

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

  // =========================
  // USER INITIAL
  // =========================

  const userInitial =
    user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#2563EB] shadow-md">
      <div className="h-full flex items-center gap-3 px-3 sm:px-5">

        {/* =========================
            LOGO
        ========================= */}

        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to MyTube home"
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <span className="text-[#2563EB] text-lg font-bold">
              ▶
            </span>
          </div>

          <span className="hidden sm:block text-xl font-extrabold tracking-tight text-white">
            MyTube
          </span>
        </button>

        {/* =========================
            SEARCH
        ========================= */}

        <form
          onSubmit={handleSearch}
          className="flex-1 flex justify-center px-1 sm:px-4"
        >
          <div className="flex w-full max-w-2xl h-10">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              aria-label="Search videos"
              className="
                flex-1
                min-w-0
                px-4
                bg-white
                text-gray-900
                placeholder-gray-400
                border border-gray-200
                rounded-l-full
                outline-none
                focus:ring-2
                focus:ring-blue-200
              "
            />

            <button
              type="submit"
              aria-label="Search"
              className="
                w-12
                shrink-0
                flex
                items-center
                justify-center
                bg-gray-100
                text-gray-700
                border border-gray-200
                border-l-0
                rounded-r-full
                hover:bg-gray-200
                transition
              "
            >
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
            <div className="w-20 h-9 rounded-full bg-white/25 animate-pulse" />
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
                  px-1.5
                  sm:px-2
                  py-1
                  rounded-full
                  hover:bg-white/10
                  transition
                "
              >
                <div className="w-9 h-9 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold">
                  {userInitial}
                </div>

                <span className="hidden lg:block text-sm font-medium text-white">
                  Profile
                </span>
              </button>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  px-3
                  sm:px-4
                  py-2
                  rounded-full
                  bg-white
                  text-[#2563EB]
                  text-sm
                  font-semibold
                  hover:bg-blue-50
                  active:scale-95
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
                sm:px-5
                py-2
                rounded-full
                bg-white
                text-[#2563EB]
                text-sm
                font-semibold
                hover:bg-blue-50
                active:scale-95
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
