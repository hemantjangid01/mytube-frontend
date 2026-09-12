import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

const API = import.meta.env.VITE_API_URL;;

  // =========================
  // AUTH STATE
  // =========================

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // =========================
  // SEARCH
  // =========================

  const searchParams = new URLSearchParams(location.search);

  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);

  // Keep search input synced with URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [location.search]);

  // =========================
  // CHECK CURRENT USER
  // =========================

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${API}/users/current-user`,
        {
          withCredentials: true,
        }
      );

      console.log("CURRENT USER:", response.data);

      setUser(response.data.data);
    } catch (error) {
      console.log(
        "User not logged in:",
        error.response?.data || error.message
      );

      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [location.pathname]);

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

    navigate(
      `/?search=${encodeURIComponent(trimmedSearch)}`
    );
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

      navigate("/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-blue-400 flex items-center px-4 sm:px-6 shadow-sm">

      {/* =========================
          LOGO
      ========================= */}

      <div
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer text-gray-900"
      >
        YouTube
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <form
        onSubmit={handleSearch}
        className="flex-1 flex justify-center mx-4 sm:mx-8"
      >
        <div className="flex w-full max-w-2xl">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search"
            className="flex-1 min-w-0 border border-gray-300 rounded-l-full px-5 py-2 outline-none focus:border-gray-500"
          />

          <button
            type="submit"
            className="px-5 sm:px-6 border border-gray-300 border-l-0 rounded-r-full bg-gray-50 hover:bg-gray-100 transition"
          >
            🔍
          </button>

        </div>
      </form>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="flex items-center gap-2 sm:gap-3">

        {/* While checking authentication */}
        {authLoading ? (

          <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />

        ) : user ? (

          /* =========================
             LOGGED IN
          ========================= */

          <>
            <button
              type="button"
              onClick={() =>
                navigate("/edit-profile")
              }
              className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>

        ) : (

          /* =========================
             LOGGED OUT
          ========================= */

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Login
          </button>

        )}

      </div>

    </header>
  );
};

export default Header;