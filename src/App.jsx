import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import MyVideos from "./pages/MyVideos";
import EditVideo from "./pages/EditVideo";
import Channel from "./pages/Channel";
import Playlist from "./pages/Playlist";
import History from "./pages/History";
import Community from "./pages/Community";
import EditProfile from "./pages/EditProfile";

import ProtectedRoute from "./components/ProtectedRoute";


const MainLayout = () => {
  return (
    <div className="min-h-screen">

      <Header />

      <div className="flex">

        <Sidebar />

        <main className="flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
};


// =====================================
// APP
// =====================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            WITHOUT HEADER / SIDEBAR
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/watch/:videoId"
              element={<Watch />}
            />

            <Route
              path="/upload"
              element={<Upload />}
            />

            <Route
              path="/my-videos"
              element={<MyVideos />}
            />

            <Route
              path="/edit-video/:videoId"
              element={<EditVideo />}
            />

            <Route
              path="/channel/:username"
              element={<Channel />}
            />

            <Route
              path="/playlists"
              element={<Playlist />}
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/community"
              element={<Community />}
            />

            <Route
              path="/edit-profile"
              element={<EditProfile />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;