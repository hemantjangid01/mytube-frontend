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
          { withCredentials: true }
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
        { withCredentials: true }
      );

      setUser(null);
      navigate("/login", { replace: true });
    } catch (error) {
      // Logout failed
    }
  };

  const userInitial =
    user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#2563EB]">
      <div className="h-full flex items-center gap-4 px-4 sm:px-6">

        {/* LOGO */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to MyTube home"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div
            className="
              w-9 h-9
              rounded-lg
              bg-white
              flex items-center justify-center
              transition
              group-hover:bg-blue-50
            "
          >
            <svg
              className="w-4.5 h-4.5 text-[#2563EB]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5.5v13l10-6.5-10-6.5Z" />
            </svg>
          </div>

          <span className="hidden sm:block text-xl font-bold tracking-tight text-white">
            MyTube
          </span>
        </button>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex justify-center px-1 sm:px-4"
        >
          <div
            className="
              flex
              w-full
              max-w-2xl
              h-10
              rounded-lg
              overflow-hidden
              bg-white
              shadow-sm
            "
          >
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
                flex
                items-center
                justify-center
                bg-gray-50
                text-gray-600
                border-l border-gray-200
                hover:bg-gray-100
                hover:text-gray-900
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 shrink-0">

          {authLoading ? (
            <div className="w-20 h-9 rounded-lg bg-white/20 animate-pulse" />
          ) : user ? (
            <>
              {/* PROFILE */}
              <button
                type="button"
                onClick={() => navigate("/edit-profile")}
                className="
                  flex items-center gap-2
                  px-2 py-1.5
                  rounded-lg
                  hover:bg-white/10
                  transition
                "
              >
                <div
                  className="
                    w-8 h-8
                    rounded-full
                    bg-white
                    text-[#2563EB]
                    flex items-center justify-center
                    text-sm font-bold
                  "
                >
                  {userInitial}
                </div>

                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-white leading-tight">
                    {user.username}
                  </p>
                  <p className="text-[11px] text-blue-100">
                    Profile
                  </p>
                </div>
              </button>

              {/* DIVIDER */}
              <div className="hidden sm:block w-px h-7 bg-white/20" />

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  px-3.5 py-2
                  rounded-lg
                  border border-white/30
                  text-white
                  text-sm font-medium
                  hover:bg-white/10
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
                px-4 py-2
                rounded-lg
                bg-white
                text-[#2563EB]
                text-sm font-semibold
                shadow-sm
                hover:bg-blue-50
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
