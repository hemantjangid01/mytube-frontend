import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen border-r border-gray-300 p-4 bg-blue-500">
      <nav className="flex flex-col gap-2">

        <Link
          to="/"
          className="p-3 rounded-lg hover:bg-gray-200"
        >
          Home
        </Link>

        <Link
          to="/history"
          className="p-3 rounded-lg hover:bg-gray-200"
        >
          History
        </Link>

        <Link
          to="/playlists"
          className="p-3 rounded-lg hover:bg-gray-200"
        >
          Playlists
        </Link>

        <Link
          to="/my-videos"
          className="p-3 rounded-lg hover:bg-gray-200"
        >
          My Videos
        </Link>

        <Link
          to="/upload"
          className="p-3 rounded-lg hover:bg-gray-200"
        >
          Upload
        </Link>

        <Link
          to="/community"
          className="p-3 rounded-lg hover:bg-gray-200"
        >
          Community
        </Link>
        <Link
          to="/edit-profile"
          className="p-3 rounded-lg hover:bg-gray-200"
        >
           Your Profile
        </Link>

      </nav>
    </aside>
  );
}