import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(
          `${API}/users/current-user`,
          {
            withCredentials: true,
          }
        );

        console.log("CURRENT USER:", response.data);

        if (response.data.success) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.log(
          "CURRENT USER ERROR:",
          error.response?.data || error.message
        );

        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <div>Checking login...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;