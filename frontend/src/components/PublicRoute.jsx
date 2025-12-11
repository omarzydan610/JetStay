import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/AuthServices/authService";

const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    // Redirect to home if already authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
