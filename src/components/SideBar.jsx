
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: (
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
            d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
          />
        </svg>
      ),
    },
    {
      name: "History",
      path: "/history",
      icon: (
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
            d="M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      name: "Playlists",
      path: "/playlists",
      icon: (
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
            d="M4 6h16M4 12h16M4 18h10"
          />
        </svg>
      ),
    },
    {
      name: "My Videos",
      path: "/my-videos",
      icon: (
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
            d="M15 10l4.5-2.5A1 1 0 0 1 21 8.37v7.26a1 1 0 0 1-1.5.87L15 14m-10 5h7a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
          />
        </svg>
      ),
    },
    {
      name: "Upload",
      path: "/upload",
      icon: (
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
            d="M12 16V4m0 0L7 9m5-5 5 5M5 20h14"
          />
        </svg>
      ),
    },
    {
      name: "Community",
      path: "/community",
      icon: (
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
            d="M17 20H7a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4ZM8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"
          />
        </svg>
      ),
    },
    {
      name: "Your Profile",
      path: "/edit-profile",
      icon: (
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
            d="M15 19a6 6 0 0 0-6 0m3-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9 1v6m3-3h-6"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-60 min-h-screen shrink-0 bg-white border-r border-gray-200 px-3 py-5">

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-[#2563EB] font-semibold"
                  : "text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="my-6 border-t border-gray-200" />

      <div className="px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          MyTube
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Your video community
        </p>
      </div>

    </aside>
  );
}
